/**
 * "FAISS" Vector Store en memoria (sin faiss-node)
 * Guarda embeddings y hace búsqueda por similitud coseno
 */

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
// reutilizamos tu función de similitud
const { cosineSimilarity } = require('../services/embedding.service');

class InMemoryVectorStore {
  constructor() {
    this.embeddings = [];  // array de vectores numéricos
    this.documents = [];   // metadata de cada chunk
    this.dimension = 1536; // text-embedding-3-small
    this.initialized = false;
  }

  /**
   * Inicializa el store (solo una vez)
   */
  async initialize() {
    if (this.initialized) return;

    logger.info('Inicializando Vector Store en memoria...');
    this.embeddings = [];
    this.documents = [];
    this.initialized = true;

    logger.info('Vector Store inicializado (sin datos previos)');
  }

  /**
   * Agrega documentos (chunks + embeddings)
   */
  async addDocuments(chunks, embeddings, metadata) {
    await this.initialize();

    if (!Array.isArray(chunks) || !Array.isArray(embeddings)) {
      throw new Error('chunks y embeddings deben ser arrays');
    }
    if (chunks.length === 0) {
      throw new Error('No hay chunks para indexar');
    }
    if (chunks.length !== embeddings.length) {
      throw new Error('chunks y embeddings no tienen la misma longitud');
    }

    logger.info(`Agregando ${chunks.length} chunks al Vector Store en memoria`);

    const documentId = uuidv4();

    for (let i = 0; i < embeddings.length; i++) {
      const embedding = embeddings[i];

      if (!Array.isArray(embedding)) {
        throw new Error(`El embedding ${i} no es un array`);
      }

      if (embedding.length !== this.dimension) {
        throw new Error(
          `Embedding con dimensión inválida: ${embedding.length} (esperado: ${this.dimension})`
        );
      }

      this.embeddings.push(embedding);

      this.documents.push({
        id: `${documentId}_${i}`,
        documentId,
        chunkIndex: i,
        text: chunks[i],
        filename: metadata.filename,
        addedAt: new Date().toISOString()
      });
    }

    logger.info(
      `Documento agregado: ${chunks.length} chunks. Total chunks en memoria: ${this.documents.length}`
    );

    return {
      documentId,
      chunksAdded: chunks.length,
      totalDocuments: this.getDocumentsList().length
    };
  }

  /**
   * Busca los k chunks más similares usando similitud coseno
   */
  async search(queryEmbedding, k = 5) {
    await this.initialize();

    if (!Array.isArray(queryEmbedding)) {
      throw new Error('El embedding de consulta debe ser un array');
    }

    if (this.embeddings.length === 0) {
      logger.warn('Búsqueda solicitada pero no hay embeddings cargados');
      return [];
    }

    if (queryEmbedding.length !== this.dimension) {
      throw new Error(
        `Embedding de consulta con dimensión inválida: ${queryEmbedding.length} (esperado: ${this.dimension})`
      );
    }

    logger.debug(
      `Buscando top ${k} resultados en ${this.embeddings.length} chunks`
    );

    const results = [];

    for (let i = 0; i < this.embeddings.length; i++) {
      const similarity = cosineSimilarity(queryEmbedding, this.embeddings[i]);
      results.push({
        ...this.documents[i],
        similarity: Number(similarity.toFixed(4))
      });
    }

    // ordenar por similitud descendente y tomar top k
    results.sort((a, b) => b.similarity - a.similarity);

    const topResults = results.slice(0, Math.min(k, results.length));

    logger.debug(`Búsqueda completada: ${topResults.length} resultados`);
    return topResults;
  }

  /**
   * Lista de documentos únicos (para el panel lateral)
   */
  getDocumentsList() {
    const uniqueDocuments = {};

    this.documents.forEach(doc => {
      if (!uniqueDocuments[doc.documentId]) {
        uniqueDocuments[doc.documentId] = {
          id: doc.documentId,
          filename: doc.filename,
          addedAt: doc.addedAt,
          chunkCount: 1
        };
      } else {
        uniqueDocuments[doc.documentId].chunkCount++;
      }
    });

    return Object.values(uniqueDocuments);
  }

  /**
   * Elimina un documento por ID
   */
  async deleteDocument(documentId) {
    await this.initialize();

    logger.info(`Eliminando documento: ${documentId}`);

    const remainingDocs = [];
    const remainingEmbeddings = [];

    this.documents.forEach((doc, idx) => {
      if (doc.documentId !== documentId) {
        remainingDocs.push(doc);
        remainingEmbeddings.push(this.embeddings[idx]);
      }
    });

    const deletedCount = this.documents.length - remainingDocs.length;

    this.documents = remainingDocs;
    this.embeddings = remainingEmbeddings;

    logger.info(
      `Documento eliminado. Chunks borrados: ${deletedCount}. Chunks restantes: ${this.documents.length}`
    );

    return { deletedCount };
  }

  /**
   * Limpia todo el índice
   */
  async clear() {
    await this.initialize();

    logger.info('Limpiando Vector Store completo (en memoria)...');

    this.documents = [];
    this.embeddings = [];

    logger.info('Vector Store limpiado');
  }

  /**
   * Estadísticas del vector store
   */
  getStats() {
    return {
      totalChunks: this.documents.length,
      totalDocuments: this.getDocumentsList().length,
      dimension: this.dimension,
      initialized: this.initialized,
      ntotal: this.embeddings.length
    };
  }
}

// Singleton
let vectorStoreInstance = null;

function getVectorStore() {
  if (!vectorStoreInstance) {
    vectorStoreInstance = new InMemoryVectorStore();
  }
  return vectorStoreInstance;
}

module.exports = {
  getVectorStore,
  FAISSVectorStore: InMemoryVectorStore
};
