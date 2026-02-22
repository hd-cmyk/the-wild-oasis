import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

export function ensureSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return supabaseAdmin;
}

type BookingSummary = {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  numGuests: number;
  hasBreakfast: boolean;
  isPaid: boolean;
  cabinId: number;
};

type AvailabilityQueryInput = {
  dateFrom: string;
  dateTo: string;
  guests?: number;
};

/**
 * Build tools for the assistant. getMyBookings requires login (userEmail);
 * checkAvailability is public.
 */
export function buildAssistantTools(userEmail: string | null | undefined) {
  const getMyBookingsTool = new DynamicStructuredTool({
    name: "getMyBookings",
    description: "Get the current user's 5 most recent bookings.",
    schema: z.object({}),
    func: async () => {
      if (!userEmail) {
        return JSON.stringify({
          ok: false,
          errorCode: "AUTH_REQUIRED",
          message: "Please sign in to view your bookings.",
        });
      }

      try {
        const supabase = ensureSupabaseAdmin();

        const { data: guest, error: guestError } = await supabase
          .from("guests")
          .select("id")
          .eq("email", userEmail)
          .single();

        if (guestError) {
          console.error("getMyBookings: guest query error", guestError);
          return "Failed to look up guest; please try again later.";
        }

        if (!guest) {
          return "No guest found for this email; they may not have any bookings yet.";
        }

        const { data: bookings, error: bookingsError } = await supabase
          .from("bookings")
          .select(
            "id, startDate, endDate, status, numGuests, hasBreakfast, isPaid, cabinId"
          )
          .eq("guestId", guest.id)
          .order("startDate", { ascending: false })
          .limit(5);

        if (bookingsError) {
          console.error("getMyBookings: bookings query error", bookingsError);
          return "Failed to fetch bookings; please try again later.";
        }

        const safeBookings: BookingSummary[] =
          (bookings ?? []) as BookingSummary[];

        return JSON.stringify(safeBookings);
      } catch (error) {
        console.error("getMyBookings tool error", error);
        return "A system error occurred while fetching bookings; please try again later.";
      }
    },
  });

  const checkAvailabilityTool = new DynamicStructuredTool({
    name: "checkAvailability",
    description:
      "Check which cabins are available for given check-in and check-out dates (optional: filter by number of guests).",
    schema: z.object({
      dateFrom: z.string().describe("Check-in date, YYYY-MM-DD."),
      dateTo: z.string().describe("Check-out date, YYYY-MM-DD."),
      guests: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Optional: number of guests, to filter by max capacity."),
    }),
    func: async (input: AvailabilityQueryInput) => {
      const { dateFrom, dateTo, guests } = input;

      if (!dateFrom || !dateTo) {
        return "Start and end dates are required to check availability.";
      }

      try {
        const supabase = ensureSupabaseAdmin();

        const { data: cabins, error: cabinsError } = await supabase
          .from("cabins")
          .select("id, name, maxCapacity, regularPrice, discount");

        if (cabinsError) {
          console.error("checkAvailability: cabins query error", cabinsError);
          return "Failed to load cabins; please try again later.";
        }

        const { data: bookings, error: bookingsError } = await supabase
          .from("bookings")
          .select("id, cabinId, startDate, endDate")
          .lt("startDate", dateTo)
          .gt("endDate", dateFrom);

        if (bookingsError) {
          console.error(
            "checkAvailability: bookings query error",
            bookingsError
          );
          return "Failed to check booking conflicts; please try again later.";
        }

        const conflictingCabinIds = new Set<number>();
        for (const booking of bookings ?? []) {
          if (booking && typeof booking.cabinId === "number") {
            conflictingCabinIds.add(booking.cabinId);
          }
        }

        let availableCabins =
          (cabins ?? []).filter(
            (cabin: { id: number }) => !conflictingCabinIds.has(cabin.id)
          ) ?? [];

        if (typeof guests === "number") {
          availableCabins = availableCabins.filter(
            (cabin: { maxCapacity?: number }) =>
              typeof cabin.maxCapacity === "number" &&
              cabin.maxCapacity >= guests
          );
        }

        return JSON.stringify(availableCabins);
      } catch (error) {
        console.error("checkAvailability tool error", error);
        return "A system error occurred while checking availability; please try again later.";
      }
    },
  });

  return [getMyBookingsTool, checkAvailabilityTool];
}
