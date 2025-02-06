// netlify/functions/classify-number.ts

import { Handler } from '@netlify/functions';
import axios from 'axios';

interface NumberResponse {
  number: number;
  is_prime: boolean;
  is_perfect: boolean;
  properties: string[];
  digit_sum: number;
  fun_fact: string;
}

interface ErrorResponse {
  number: string | number;
  error: true;
}

const isArmstrong = (num: number): boolean => {
  const digits = String(Math.abs(num)).split('');
  const power = digits.length;
  const sum = digits.reduce((acc, digit) => 
    acc + Math.pow(parseInt(digit), power), 0);
  return sum === Math.abs(num);
};

const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i <= Math.sqrt(num); i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

const isPerfect = (num: number): boolean => {
  if (num <= 1) return false;
  let sum = 1;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i;
    }
  }
  return sum === num;
};

const getDigitSum = (num: number): number => {
  return String(Math.abs(num))
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit), 0);
};

const getProperties = (num: number): string[] => {
  const properties: string[] = [];
  if (isArmstrong(num)) {
    properties.push('armstrong');
  }
  properties.push(num % 2 === 0 ? 'even' : 'odd');
  return properties;
};

const getFunFact = async (num: number): Promise<string> => {
  try {
    const response = await axios.get(`http://numbersapi.com/${num}/math`, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    return `${num} is ${num % 2 === 0 ? 'even' : 'odd'} and ${isPrime(num) ? 'is' : 'is not'} prime.`;
  }
};

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  const number = event.queryStringParameters?.number;

  // Validate input - must be a valid integer
  if (!number || number.trim() === '') {
    const response: ErrorResponse = {
      number: number || '',
      error: true
    };
    
    return {
      statusCode: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(response)
    };
  }

  // Check if the input is a valid number
  const parsedNumber = parseInt(number);
  if (isNaN(parsedNumber) || !Number.isInteger(parsedNumber)) {
    const response: ErrorResponse = {
      number: number,
      error: true
    };
    
    return {
      statusCode: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(response)
    };
  }

  const funFact = await getFunFact(parsedNumber);

  const response: NumberResponse = {
    number: parsedNumber,
    is_prime: isPrime(parsedNumber),
    is_perfect: isPerfect(parsedNumber),
    properties: getProperties(parsedNumber),
    digit_sum: getDigitSum(parsedNumber),
    fun_fact: funFact
  };

  return {
    statusCode: 200,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(response)
  };
};