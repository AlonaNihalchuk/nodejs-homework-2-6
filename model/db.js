const fs = require("fs/promises");
const path = require("path");

class FileAdapter {
  constructor(file) {
    this.store = path.join(__dirname, file);
  }

  async read() {
    const result = await fs.readFile(this.store, "utf8");
    const data = JSON.parse(result);
    return data;
  }

  async write(data) {
    const result = await fs.writeFile(
      this.store,
      JSON.stringify(data, null, 2)
    );
    return result;
  }
}
module.exports = FileAdapter;
