import { Database } from "bun:sqlite";

const db = new Database("mydb.sqlite", { create: true });
db.run(
  "CREATE TABLE IF NOT EXISTS permission (id VARCHAR PRIMARY KEY, password VARCHAR)",
);
const query = db.query(
  "INSERT INTO permission (id, password) VALUES ($id, $password)",
);

export const addPDF = (id: string, password: string) => {
  try {
    query.run({ $password: password, $id: id });
  } catch (e) {
    console.log(e.message);
  }
};

export const isPdfPermissionGrant = (id: string, password: string) => {
  try {
    const getQuery = db.query(
      `select * from permission where id="${id}" and password="${password}";`,
    );
    return getQuery.get()?.id ? true : false;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
