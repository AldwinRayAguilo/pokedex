// src/api.js
import axios from 'axios';

const jsonServer = axios.create({
  baseURL: 'http://localhost:3001'
});

export default jsonServer;
