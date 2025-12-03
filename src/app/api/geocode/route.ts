import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY is not set in environment variables')
    return NextResponse.json({ error: 'Google Maps API key not configured' }, { status: 500 })
  }

  try {
    // Add Singapore to the query for better results
    const searchQuery = query.toLowerCase().includes('singapore') ? query : `${query}, Singapore`
    
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${apiKey}&region=sg`
    console.log('Geocoding URL:', geocodeUrl.replace(apiKey, 'API_KEY_HIDDEN'))
    
    const response = await fetch(geocodeUrl)

    if (!response.ok) {
      console.error(`Geocoding API HTTP error: ${response.status}`)
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Geocoding full response:', JSON.stringify(data, null, 2))

    if (data.status === 'REQUEST_DENIED') {
      console.error('Geocoding API request denied:', data.error_message)
      return NextResponse.json({ 
        error: `API Error: ${data.error_message || 'Request denied. Check API key permissions and restrictions.'}` 
      }, { status: 403 })
    }

    if (data.status === 'OVER_QUERY_LIMIT') {
      return NextResponse.json({ error: 'API quota exceeded. Please try again later.' }, { status: 429 })
    }

    if (data.status === 'ZERO_RESULTS' || !data.results || data.results.length === 0) {
      return NextResponse.json({ error: `No results found for "${query}"` }, { status: 404 })
    }

    if (data.status !== 'OK') {
      console.error('Geocoding API error status:', data.status, data.error_message)
      return NextResponse.json({ error: `Geocoding failed: ${data.status} - ${data.error_message || 'Unknown error'}` }, { status: 500 })
    }

    const result = data.results[0]
    const { lat, lng } = result.geometry.location

    return NextResponse.json({
      lat,
      lng,
      formattedAddress: result.formatted_address
    })
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json(
      { error: 'Failed to geocode location' },
      { status: 500 }
    )
  }
}

// TODO: Add rate limiting for production
