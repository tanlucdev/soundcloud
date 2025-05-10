
export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const fileName = searchParams.get('audio');
  // return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${fileName}`)
  return await fetch(`http://localhost:8000/tracks/hoidanit.mp3`)
}