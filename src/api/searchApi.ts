import { getUsers } from "./userApi";

export async function userSearch(keyword: string) {
  try {
    console.log("search");
    const users = await getUsers();
    const filteredUsers = users?.filter((user) =>
      user.nickName.includes(keyword)
    );
    return filteredUsers;
  } catch (error) {
    console.log(error);
    return [];
  }
}
