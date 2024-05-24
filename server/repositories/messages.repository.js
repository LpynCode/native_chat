

class MessagesRepository {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        const query = 'SELECT * FROM messages ORDER BY created_at ASC';
        const { rows } = await this.pool.query(query);
        return rows;
    }

    async create(dto) {
        const query = 'INSERT INTO messages (name, text) VALUES ($1, $2) RETURNING *';
        const { rows } = await this.pool.query(query, [dto.name, dto.text]);
        return rows[0];
    }
}

module.exports = MessagesRepository