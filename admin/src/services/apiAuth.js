import supabase from "./supabase.js";
import { supabaseUrl } from "./supabase.js";
export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });
  if (error) throw new Error("Supabase signup error: " + error.message);
  return data;
}
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) throw new Error("Supabase login error: " + error.message);
  return data;
}
export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw new Error("Supabase get user error: " + error.message);
  return user;
}
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Supabase logout error: " + error.message);
}
export async function updateCurrentUser({ password, fullName, avatar }) {
  //1. Update password OR fullName
  let updateData = {};
  if (password) updateData.password = password;

  if (fullName) updateData.data = { ...updateData.data, fullName };
  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);
  if (!avatar) return data;
  //2. Upload the avatar image to Supabase Storage
  const fileName = `avatar-${data.user.id}-${Math.random()}`;
  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);
  if (storageError)
    throw new Error("Avatar image upload failed: " + storageError.message);
  //3.Update avatar in the user
  const { data: updateUser, error: updateError } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
      },
    });
  if (updateError) throw new Error(updateError.message);

  return updateUser;
}
