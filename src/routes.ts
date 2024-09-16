import { Server } from "@hapi/hapi"

export const defineRoutes = (server: Server) => {
    server.route({
        method: 'GET',
        path: '/ping',
        handler: async (request, h) => {
            return {
                ok: true
            }
        }
    })

    let items = [];

    server.route({
        method: 'GET',
        path: '/items',
        handler: async (request, h) => {
            return h.response(items).code(200)
        }
    });

    server.route({
        method: 'POST',
        path: '/items',
        handler: async (request, h) => {
            const { name, price } = request.payload;
            if (!name || !price) {
                return h.response({
                    errors: [
                        {
                            field: 'price',
                            message: 'Field "price" is required'
                        }
                    ]
                }).code(400)
            }
            if (price < 0) {
                return h.response({
                    errors: [
                        {
                            field: 'price',
                            message: 'Field "price" cannot be negative'
                        }
                    ]
                }).code(400)
            }
            const item = { id: Math.floor(Math.random() * 100), name, price };
            items.push(item);
            return h.response(item).code(201)
        }
    });

    server.route({
        method: 'GET',
        path: '/items/{id}',
        handler: async (request, h) => {
            const id = parseInt(request.params.id);
            const item = items.find(i => i.id === id);
            if (!item) {
                return h.response().code(404)
            }
            return h.response(item).code(200)
        }
    });

    server.route({
        method: 'PUT',
        path: '/items/{id}',
        handler: async (request, h) => {
            const id = parseInt(request.params.id);
            const item = items.find(i => i.id === id);
            if (!item) {
                return h.response().code(404)
            }
            const { name, price } = request.payload;
            if (price < 0) {
                return h.response({
                    errors: [
                        {
                            field: 'price',
                            message: 'Field "price" cannot be negative'
                        }
                    ]
                }).code(400)
            }
            item.name = name;
            item.price = price;
            return h.response(item).code(200)
        }
    });

    server.route({
        method: 'DELETE',
        path: '/items/{id}',
        handler: async (request, h) => {
            const id = parseInt(request.params.id);
            const index = items.findIndex(i => i.id === id);
            if (index === -1) {
                return h.response().code(404)
            }
            items.splice(index, 1);
            return h.response().code(204)
        }
    });

}