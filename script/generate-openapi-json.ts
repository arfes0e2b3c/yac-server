import fs from 'fs'
import axios from 'axios'

async function generateOpenApiJson() {
	try {
		const res = await axios.get('http://localhost:8080/api/doc')
		fs.writeFileSync('openapi.json', JSON.stringify(res.data, null, 2))
		console.log('openapi.json generated successfully')
	} catch (err) {
		console.error('Error generating openapi.json', err)
	}
}

generateOpenApiJson()
