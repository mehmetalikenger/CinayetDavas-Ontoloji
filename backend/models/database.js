// models/database.js
const SparqlClient = require("sparql-client-2");

class Database {
  constructor(endpointUrl) {
    this.client = new SparqlClient(endpointUrl, {
      defaultParameters: { format: "json" },
    });
  }

  query(sparqlQuery) {
    return this.client.query(sparqlQuery).execute();
  }
}

module.exports = Database;
