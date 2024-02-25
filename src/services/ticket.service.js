const ticketModel = require("../models/ticket.model");

class TicketDao {
  async getTickets() {
    try {
      return await ticketModel.find();
    } catch (error) {
      console.log(error);
    }
  }

  async getByCode(code) {
    try {
      return await ticketModel.findOne({ code });
    } catch (error) {
      console.log(error);
    }
  }

  async addTicket(newTicket) {
    try {
      return await ticketModel.create(newTicket);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTicket(code) {
    try {
      return await ticketModel.findOneAndDelete({ code });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new TicketDao();
