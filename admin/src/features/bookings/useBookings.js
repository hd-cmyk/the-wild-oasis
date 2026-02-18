import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";
export function useBookings() {
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("status") || "all";
  // FILTER
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };
  // SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [sortField, sortDirection] = sortByRaw.split("-");
  const sortBy = { field: sortField, direction: sortDirection };

  //PAGINATION
  const page = Number(searchParams.get("page") || 1);

  //QUERY
  const {
    data: { data: bookings, count } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  //PRE-FETCH NEXT PAGE
  const pageCount = Math.ceil(count / PAGE_SIZE);
  const queryClient = useQueryClient();
  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
      enabled: page < pageCount,
    });
  }
  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
      enabled: page > 1,
    });
  }

  return { bookings, isLoading, error, count };
}
