const request = require("supertest");
const app = require("../server");

describe("POST /api/contacto", () => {
  it("debe guardar mensaje valido y devolver status 200", async () => {
    const contactoValido = {
      nombre: "Josefina",
      email: "josefina@example.com",
      mensaje: "Hola, me interesa una guitarra",
      telefono: "1234567"
    };
//simular el envio de un mensaje de contacto valido
    const res = await request(app)
      .post("/api/contacto")
      .send(contactoValido);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("mensaje");
  });
//rechazo por nombre
  it("debe rechazar si falta el nombre", async () => {
    const contacto = {
      nombre: "",
      email: "josefina@example.com",
      mensaje: "Consulta",
      telefono: "123456789"
    };

    const res = await request(app).post("/api/contacto").send(contacto);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
//rechazo por email
  it("debe rechazar si falta el email", async () => {
    const contacto = {
      nombre: "Josefina",
      email: "",
      mensaje: "Consulta",
      telefono: "1234567"
    };

    const res = await request(app).post("/api/contacto").send(contacto);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
//rechazo por mensaje
  it("debe rechazar si falta el mensaje", async () => {
    const contacto = {
      nombre: "Josefina",
      email: "josefina@example.com",
      mensaje: "",
      telefono: "1234567"
    };

    const res = await request(app).post("/api/contacto").send(contacto);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

