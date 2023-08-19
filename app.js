const express = require("express");
const app = express();
var format = require("date-fns/format");
var isValid = require("date-fns/isValid");
const toDate = require("date-fns/toDate");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const path = require("path");
const dbpath = path.join(__dirname, "todoApplication.db");
let db = null;
const ids = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running...");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
ids();
const checkRequestQueries = async (request, response, next) => {
  const { id, category, priority, status, date } = request.query;
  const { todoId } = request.params;
  if (category !== undefined) {
    const categoryArray = ["WORK", "HOME", "LEARNING"];
    const categoryIsInArray = categoryArray.includes(category);
    if (categoryIsInArray === true) {
      request.category === category;
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
      return;
    }
  }
  if (priority !== undefined) {
    const priorityArray = ["HIGH", "MEDIUM", "LOW"];
    const priorityIsInArray = priorityArray.includes(priority);
    if (priorityIsInArray === true) {
      request.priority === priority;
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
      return;
    }
  }
  if (status !== undefined) {
    const statusArray = ["TO DO", "IN PROGRESS", "DONE"];
    const statusIsInArray = statusArray.includes(status);
    if (statusIsInArray === true) {
      request.status === status;
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
      return;
    }
  }
  if (date !== undefined) {
    try {
      const myDate = new Date(date);
      const formatedDate = format(new Date(date), "yyyy/MM/dd");
      const result = toDate(
        new Date`${myDate.getFullYear()}-${myDate.getMonth()}+1-${myDate.getDate()}`()
      );
      const validate = await isValid(result);
      if (validate === true) {
        request.date = formatedDate;
      } else {
        response.status(400);
        response.send("Invalid Due Date");
        return;
      }
    } catch (e) {
      response.status(400);
      response.send("Invalid Due Date");
      return;
    }
    request.todo = todo;
    request.todoId = todoId;
    request.id = id;
  }
  next();
};

const checkRequestBody = async (request, response, next) => {
  const { id, todo, category, priority, status, dueDate } = request.body;
  const { todoId } = request.params;
  if (category !== undefined) {
    const categoryArray = ["WORK", "HOME", "LEARNING"];
    const categoryIsInArray = categoryArray.includes(category);
    if (categoryIsInArray === true) {
      request.category === category;
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
      return;
    }
  }
  if (priority !== undefined) {
    const priorityArray = ["HIGH", "MEDIUM", "LOW"];
    const priorityIsInArray = priorityArray.includes(priority);
    if (priorityIsInArray === true) {
      request.priority === priority;
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
      return;
    }
  }

  if (status !== undefined) {
    const statusArray = ["TO DO", "IN PROGRESS", "DONE"];
    const statusIsInArray = statusArray.includes(status);
    if (statusIsInArray === true) {
      request.status === status;
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
      return;
    }
  }
  if (dueDate !== undefined) {
    try {
      const myDate = new Date(dueDate);
      const formatedDate = format(new Date(dueDate), "yyyy/MM/dd");
      result = toDate(new Date(formatedDate));
      const validate = await isValid(result);
      if (validate === true) {
        request.date = formatedDate;
      } else {
        response.status(400);
        response.send("Invalid Due Date");
        return;
      }
    } catch (e) {
      response.status(400);
      response.send("Invalid Due Date");
      return;
    }
    request.todo = todo;
    request.todoId = todoId;
    request.id = id;
  }
  next();
};

//get API 1
app.get("/todos/", checkRequestQueries, async (request, response) => {
  const {
    search_q = "",
    status = "",
    priority = "",
    category = "",
  } = request.query;
  const getQuery = `select id ,todo,priority,status, category,due_date as dueDate  from todo where todo like '%${search_q}%' and status like '%${status}%' and priority like '%${priority}%' and category like '%${category}%'`;
  const dbResponse = await db.all(getQuery);
  response.send(dbResponse);
});
//API 2
app.get("/todos/:todoId/", checkRequestQueries, async (request, response) => {
  const {
    search_q = "",
    status = "",
    priority = "",
    category = "",
  } = request.query;
  const { todoId } = request.params;
  const getQuery = `select id ,todo,priority,status, category,due_date as dueDate  from todo where todo.id=${todoId}`;
  const dbResponse = await db.get(getQuery);
  response.send(dbResponse);
});
//API 3
app.get("/agenda/", checkRequestQueries, async (request, response) => {
  const { date } = request.query;
  const dateFormat = format(new Date(date), "yyyy-MM-dd");
  const getQuery = `select id ,todo,priority,status, category,due_date as dueDate  from todo where due_date='${dateFormat}'`;
  const dbResponse = await db.all(getQuery);
  response.send(dbResponse);
});

app.post("/todos/", checkRequestBody, async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  const getQuery = `insert into todo(id ,todo,priority,status ,category,due_date) values (${id},'${todo}','${priority}','${status}','${category}','${dueDate}')`;
  const dbResponse = await db.run(getQuery);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", checkRequestBody, async (request, response) => {
  const { todoId } = request.params;
  const { todo, priority, status, category, dueDate } = request.body;

  let result = "";
  switch (true) {
    case todo !== undefined:
      result = `update todo
           set
            todo= '${todo}'
            where id =${todoId}`;

      await db.run(result);
      response.send(`Todo  Updated`);
      break;

    case priority !== undefined:
      result = `update todo
           set
            priority='${priority}'
            where id =${todoId}`;
      await db.run(result);
      response.send(`Priority  Updated`);
      break;

    case status !== undefined:
      result = `update todo
    set
     status='${status}'
     where id =${todoId}`;
      await db.run(result);
      response.send(`Status  Updated`);
      break;

    case category !== undefined:
      result = `
         update 
         todo
         set 
           category='${category}'
            where id =${todoId}`;
      await db.run(result);
      response.send(`Category  Updated`);
      break;

    case todo !== undefined:
      result = `update todo
           set
       due_date='${dueDate}' 
            where id =${todoId}`;
      await db.run(result);
      response.send(`Due Date  Updated`);
      break;
  }
});

app.delete(
  "/todos/:todoId/",
  checkRequestQueries,
  async (request, response) => {
    const { todoId } = request.params;
    const getQuery = `delete from todo where id =${todoId}`;
    const dbResponse = await db.run(getQuery);
    response.send("Todo Deleted");
  }
);
module.exports = app;
