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
  error: true;
  number: string;
}

const isArmstrong = (num: number): boolean => {
  if (num < 1) return false;
  const numStr = String(num);
  const power = numStr.length;
  const sum = numStr.split('').reduce((acc, digit) => 
    acc + Math.pow(parseInt(digit), power), 0);
  return sum === num;
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
      if (i !== num && i !== num / i) {
        sum += num / i;
      }
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
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  const number = event.queryStringParameters?.number;

  if (!number || number.trim() === '') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: true,
        number: number || ""
      })
    };
  }

  if (isNaN(Number(number)) || !Number.isInteger(Number(number))) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: true,
        number: number
      })
    };
  }

  const num = parseInt(number);
  const funFact = await getFunFact(num);

  const response: NumberResponse = {
    number: num,
    is_prime: isPrime(num),
    is_perfect: isPerfect(num),
    properties: getProperties(num),
    digit_sum: getDigitSum(num),
    fun_fact: funFact
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(response)
  };
};