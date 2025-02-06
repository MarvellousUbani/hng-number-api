# Number Classification API

A serverless API that takes a number and returns interesting mathematical properties about it, along with a fun fact.

## API Endpoint

```
GET [https://your-netlify-site.netlify.app/api/classify-number?number=371](https://number-hng-api-bruva.netlify.app/api/classify-number?number=371)
```

## Response Format

### Success Response (200 OK)

```json
{
    "number": 371,
    "is_prime": false,
    "is_perfect": false,
    "properties": ["armstrong", "odd"],
    "digit_sum": 11,
    "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}
```

### Error Response (400 Bad Request)

```json
{
    "number": "invalid",
    "error": true
}
```

## Features

- Determines if a number is prime
- Determines if a number is perfect
- Calculates the sum of digits
- Identifies Armstrong numbers
- Determines if a number is odd or even
- Fetches interesting math facts from Numbers API
- CORS enabled
- Input validation
- Error handling

## Mathematical Properties

1. **Prime Numbers**: A number that has exactly two factors: 1 and itself
2. **Perfect Numbers**: A number that equals the sum of its proper divisors
3. **Armstrong Numbers**: A number that equals the sum of its own digits raised to the power of the number of digits
4. **Digit Sum**: The sum of all digits in the number
5. **Parity**: Whether the number is odd or even

## Local Development

1. Clone the repository
```bash
git clone https://github.com/MarvellousUbani/hng-number-api
cd hng-number-api
```

2. Install dependencies
```bash
npm install
```

3. Install Netlify CLI
```bash
npm install -g netlify-cli
```

4. Start local development server
```bash
netlify dev
```

## Deployment

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Deploy with the following settings:
   - Build command: `npm run build`
   - Publish directory: `public`
   - Functions directory: `netlify/functions`

## Built With

- TypeScript
- Netlify Functions
- Numbers API

## License

This project is licensed under the MIT License - see the LICENSE file for details.
