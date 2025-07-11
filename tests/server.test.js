const request = require("supertest");
const app = require("../server");

describe("GET /api/products", () => {
  it("debe devolver un array de productos y status 200", async () => {
    const response = await request(app).get("/api/products");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

// describe("POST /api/register", () => {
//   it("debe registrar un nuevo usuario y devolver status 201", async () => {
//     const newUser = {
//       username: "testuser",
//       password: "testpassword",
//       email: "testuser@email.com",
//     };
//     const response = await request(app).post("/api/register").send(newUser);

//     expect(response.statusCode).toBe(201);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Usuario registrado correctamente."
//     );
//   });
// });

describe("POST /api/login", () => {
  it("debe iniciar sesión con credenciales válidas y devolver status 200", async () => {
    const credentials = {
      email: "testuser@email.com",
      password: "testpassword",
    };
    const response = await request(app).post("/api/login").send(credentials);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Login exitoso.");
  });

  it("debe devolver error 400 si faltan campos obligatorios", async () => {
    const response = await request(app).post("/api/login").send({
      email: "",
      password: "",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Los campos email y password son obligatorios."
    );
  });
});

describe("GET /api/cart", () => {
  it("debe devolver un array vacío para un usuario nuevo", async () => {
    const response = await request(app).get("/api/cart?user=testcarrito");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});

describe("POST /api/cart", () => {
  it("debe guardar y devolver el carrito del usuario", async () => {
    const items = [{ id: 1, nombre: "Producto de prueba", cantidad: 2 }];
    // Guardar el carrito
    await request(app).post("/api/cart").send({ user: "testcarrito", items });
    // Obtener el carrito
    const response = await request(app).get("/api/cart?user=testcarrito");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(items);
  });
});
