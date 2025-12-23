const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath);

console.log("📊 Viewing Database Data\n");
console.log("=".repeat(80));

db.serialize(() => {
  db.all("SELECT * FROM conversations", [], (err, conversations) => {
    if (err) {
      console.error("Error fetching conversations:", err);
      return;
    }

    console.log(`\n📁 CONVERSATIONS (${conversations.length} total):`);
    console.log("=".repeat(80));

    if (conversations.length === 0) {
      console.log("No conversations found.\n");
      db.close();
      return;
    }

    conversations.forEach((conv, index) => {
      console.log(`\n[${index + 1}] Conversation ID: ${conv.id}`);
      console.log(`    Created: ${conv.created_at}`);
      console.log(`    Updated: ${conv.updated_at}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("\n💬 MESSAGES:");
    console.log("=".repeat(80));

    db.all(
      "SELECT * FROM messages ORDER BY created_at ASC",
      [],
      (err, messages) => {
        if (err) {
          console.error("Error fetching messages:", err);
          db.close();
          return;
        }

        if (messages.length === 0) {
          console.log("No messages found.\n");
          db.close();
          return;
        }

        console.log(`\nTotal Messages: ${messages.length}\n`);

        let currentConvId = null;
        messages.forEach((msg, index) => {
          if (msg.conversation_id !== currentConvId) {
            currentConvId = msg.conversation_id;
            console.log(`\n${"─".repeat(80)}`);
            console.log(`📝 Conversation: ${msg.conversation_id}`);
            console.log("─".repeat(80));
          }

          const icon = msg.sender === "user" ? "👤" : "🤖";
          const sender = msg.sender === "user" ? "USER" : "AI";

          console.log(`\n[${index + 1}] ${icon} ${sender}`);
          console.log(`    Time: ${msg.created_at}`);
          console.log(`    Text: ${msg.text}`);
        });

        console.log("\n" + "=".repeat(80));
        console.log("\n✅ Database query completed!\n");

        db.close();
      }
    );
  });
});
