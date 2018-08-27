API documentation
---------------------------------------------------------------------------------

#### Endpoints
- aud for JWT token: https://donatelifeamerica.com/api/ (token must contain this Endpoint)
- aud for dev requests: https://dla.lifelogics.org
- Request API access token: https://dla.lifelogics.org/api/token

#### Request example PHP
}{∏Ø’”
$response = $this->client->request('POST', $this->getRequestUrl('token'), [
  RequestOptions::JSON => [
    'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    'assertion'  => $jwt
  ]
]);

#### Request example HTTP
POST /api/token HTTP/1.1
Host: dl.lifelogics.org
User-Agent: curl
Connection: close
Content-Length: 347
Accept-Encoding: gzip, deflate
Connection: close
Content-Type: application/json
{"grant_type":"urn:ietf:params:oauth:grant-type:jwt-bearer","assertion":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0MjUwNTU2ODgsImlzcyI6IjMxMzhaWkdhWFFFWjJTVzFFcmp1In0.kS556ehBpyjx4RHvFA6AwosTgpBw0baTWVq4unDSwi80B8-PKZRG9LEF8_OaW0Ao05IXOjjZ71hKKKhzkuI8H6HDMI4aYJhoU5D___TaQAAZvFyRhc-Z7SXbtSmQs861Y3wpBbH7UzTksAoZ9TBdwG4XX6jITj1bKREGKUEUZco"}
