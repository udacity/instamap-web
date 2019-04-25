export class LatLng {
  constructor(
    public lat: number,
    public lng: number) {}
}

export type ImageMetadata = {
  id: string
  title: string
  description: string
  date: string
  time: string
  camera: string
  scene: string
  altitude: string
  position: string
  hashtags: string[]
  imageUrl: string
  imageThumbUrl: string
  imageThumbMediumUrl: string
  imageThumbLargeUrl: string
}
