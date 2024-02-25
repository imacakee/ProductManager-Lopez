class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getTickets() {
    return await this.dao.getTickets();
  }

  async getByCode(code) {
    return await this.dao.getByCode(code);
  }

  async addTicket(newTicket) {
    return await this.dao.addTicket(newTicket);
  }

  async deleteTicket(code) {
    return await this.dao.deleteTicket(code);
  }
}

module.exports = TicketRepository;
