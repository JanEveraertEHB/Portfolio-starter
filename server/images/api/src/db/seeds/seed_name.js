/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("Replies").del();
  await knex("Threads").del();
  await knex("Users").del();

  // Insert initial data into Users table
  await knex("Users").insert([
    {
      user_id: 1,
      username: "admin",
      password_hash: "hashed_password1",
      role: "admin",
    },
    {
      user_id: 2,
      username: "moderator",
      password_hash: "hashed_password2",
      role: "moderator",
    },
    {
      user_id: 3,
      username: "member1",
      password_hash: "hashed_password3",
      role: "member",
    },
    {
      user_id: 4,
      username: "member2",
      password_hash: "hashed_password4",
      role: "member",
    },
  ]);

  // Insert initial data into Threads table
  await knex("Threads").insert([
    {
      thread_id: 1,
      title: "Welcome to the forum",
      content: "This is the first thread.",
      user_id: 1,
      status: "open",
    },
    {
      thread_id: 2,
      title: "General Discussion",
      content: "Feel free to talk about anything here.",
      user_id: 2,
      status: "open",
    },
  ]);

  // Insert initial data into Replies table
  await knex("Replies").insert([
    {
      reply_id: 1,
      thread_id: 1,
      content: "Thank you for the welcome!",
      user_id: 3,
      status: "active",
    },
    {
      reply_id: 2,
      thread_id: 2,
      content: "This is a great place to discuss topics.",
      user_id: 4,
      status: "active",
    },
  ]);
};
