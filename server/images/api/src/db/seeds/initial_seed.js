const { v4: uuidv4 } = require("uuid");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries and resets primary key sequences
  await knex.raw('TRUNCATE TABLE "Replies" RESTART IDENTITY CASCADE');
  await knex.raw('TRUNCATE TABLE "Threads" RESTART IDENTITY CASCADE');
  await knex.raw('TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE');

  // Inserts seed entries and retrieves the inserted user IDs
  const [admin, moderator, member] = await knex("Users")
    .insert([
      {
        UUID: uuidv4(),
        username: "admin",
        password_hash: "hashed_password",
        role: "admin",
      },
      {
        UUID: uuidv4(),
        username: "moderator",
        password_hash: "hashed_password",
        role: "moderator",
      },
      {
        UUID: uuidv4(),
        username: "member",
        password_hash: "hashed_password",
        role: "member",
      },
    ])
    .returning(["user_id"]);

  // Inserts seed entries for Threads using the retrieved user IDs
  const [firstThread] = await knex("Threads")
    .insert([
      {
        title: "First Thread",
        content: "This is the first thread",
        user_id: admin.user_id,
        status: "open",
      },
      {
        title: "Second Thread",
        content: "This is the second thread",
        user_id: moderator.user_id,
        status: "open",
      },
    ])
    .returning(["thread_id"]);

  // Inserts seed entries for Replies using the retrieved thread IDs and user IDs
  await knex("Replies").insert([
    {
      content: "This is a reply to the first thread",
      thread_id: firstThread.thread_id,
      user_id: member.user_id,
      status: "active",
    },
    {
      content: "This is another reply to the first thread",
      thread_id: firstThread.thread_id,
      user_id: moderator.user_id,
      status: "active",
    },
  ]);
};
