# Permalist

Permalist is a simple web-based todo list application. It uses Node.js and Express for the server, EJS for rendering the HTML pages, and PostgreSQL for storing todo items permanently.

The application currently supports:

- Viewing todo items saved in PostgreSQL
- Adding new todo items
- Editing existing todo items
- Completing (deleting) todo items
- Serving CSS and JavaScript assets from the `public` folder

## Technology Stack

- **Node.js**: Runs the application server
- **Express**: Handles HTTP requests and routes
- **EJS**: Renders the todo list page
- **PostgreSQL**: Stores todo items
- **node-postgres (`pg`)**: Connects Node.js to PostgreSQL
- **dotenv**: Loads database settings from the `.env` file
- **body-parser**: Reads form data submitted by the browser

## Requirements

Install these tools on the computer where you want to run the project:

1. **Node.js**. Use a current LTS release. Check that it is installed with:

   ```bash
   node --version
   npm --version
   ```

2. **PostgreSQL**. During installation, remember the PostgreSQL username and password. PostgreSQL normally runs on port `5432`.

3. **Git**, if you are downloading the project from a Git repository.

## Run the Project on Another Computer

### 1. Download the project

Using Git:

```bash
git clone <repository-url>
cd <project-folder>
```

Alternatively, copy or download the project folder and open a terminal in that folder.

Do not copy the existing `node_modules` folder. It is ignored by Git and will be recreated locally.

### 2. Install Node.js packages

From the project folder, run:

```bash
npm install
```

This reads `package.json` and installs the required packages listed in `package-lock.json`.

### 3. Create the PostgreSQL database

Create a database named `permalist`.

With the PostgreSQL command-line tool:

```bash
createdb -U postgres permalist
```

Or create it using pgAdmin:

1. Open pgAdmin.
2. Connect to your PostgreSQL server.
3. Right-click **Databases** and choose **Create > Database**.
4. Set the database name to `permalist`.
5. Save the database.

### 4. Create the `items` table

Connect to the new `permalist` database and run this SQL:

```sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  todo VARCHAR(100) NOT NULL
);
```

Optional sample data:

```sql
INSERT INTO items (todo)
VALUES ('Buy milk'), ('Finish homework');
```

Using `psql`, the commands can be run like this:

```bash
psql -U postgres -d permalist
```

Then paste the SQL above and type `\\q` to exit.

### 5. Create the environment file

Create a file named `.env` in the project root, next to `index.js` and `package.json`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_postgresql_password
DB_NAME=permalist
```

Replace `your_postgresql_password` with the password for the PostgreSQL user on that computer.

Never commit `.env` to Git or share the database password. This project already ignores `.env` through `.gitignore`.

If PostgreSQL is running on another machine, change `DB_HOST` to that machine's hostname or IP address. Make sure PostgreSQL accepts remote connections and that its firewall allows port `5432`.

### 6. Start the application

Run:

```bash
npm start
```

You should see a message showing that the server is running. Open this address in a browser:

```text
http://localhost:3000
```

To use a different port, change `PORT` in `.env`. For example:

```env
PORT=4000
```

Then open `http://localhost:4000`.

Stop the server with `Ctrl+C` in the terminal.

## How the Application Works

1. `index.js` loads the environment variables from `.env`.
2. Express starts a server and creates a PostgreSQL connection pool.
3. A browser request to `GET /` loads rows from the `items` table.
4. The rows are passed to `views/index.ejs`.
5. EJS generates the HTML todo list.
6. The browser submits forms to add or edit items.
7. PostgreSQL stores the changes, so the items remain after the server restarts.

## Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/` | Reads all items and displays the todo list |
| `POST` | `/add` | Inserts a new item from the `newItem` form field |
| `POST` | `/edit` | Updates an item using `updatedItemId` and `updatedItemTitle` |
| `POST` | `/delete` | Deletes an item using `deleteItemId` |

## Project Structure

```text
.
├── index.js                  # Express server, routes, and database connection
├── package.json              # Project metadata, scripts, and dependencies
├── package-lock.json         # Exact dependency versions installed by npm
├── queries.sql               # SQL notes for the database
├── solution.js               # Older reference implementation / scratch file
├── public/
│   ├── assets/icons/         # Icons used by the page
│   ├── js/main.js            # Client-side interactions
│   └── styles/main.css       # Application styling
├── views/
│   ├── index.ejs             # Main todo list template
│   └── partials/
│       ├── header.ejs        # HTML beginning and page header
│       └── footer.ejs        # Page footer
└── .env                      # Local settings; do not commit this file
```

## Important Database Note

The current running application uses the column name `todo` in its SQL queries and in `index.ejs`:

```sql
SELECT * FROM items ORDER BY id ASC;
```

and:

```sql
INSERT INTO items (todo) VALUES ($1);
```

Therefore, the table must contain a `todo` column. The existing `queries.sql` file uses `title` instead, so running that file unchanged will not match the current application. Use the schema in this README, or update `queries.sql` before using it.

## Troubleshooting

### `password authentication failed`

Check `DB_USER` and `DB_PASSWORD` in `.env`. Make sure they match a PostgreSQL user on the computer running the database.

### `database "permalist" does not exist`

Create the database using the instructions above, or change `DB_NAME` to the name of an existing database.

### `relation "items" does not exist`

The database exists, but the table has not been created. Run the `CREATE TABLE` statement from this README.

### `column "todo" does not exist`

The table was probably created with a `title` column. Rename it with:

```sql
ALTER TABLE items RENAME COLUMN title TO todo;
```

### The page cannot connect to PostgreSQL

Confirm that PostgreSQL is running and listening on port `5432`. Also verify `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `.env`.

### Port `3000` is already in use

Set another port in `.env`, then restart the server:

```env
PORT=4000
```

## Current Limitations

- There is no automated test suite yet.
- The application is configured as a simple local project and does not include production deployment configuration.

## Useful Commands

```bash
npm install       # Install dependencies
npm start         # Start the server
npm ls --depth=0  # Show installed top-level packages
node --check index.js  # Check index.js syntax
```
