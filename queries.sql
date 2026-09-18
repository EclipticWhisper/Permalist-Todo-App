CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  todo VARCHAR(100) NOT NULL
);

INSERT INTO items (todo) VALUES ('Buy milk'), ('Finish homework');