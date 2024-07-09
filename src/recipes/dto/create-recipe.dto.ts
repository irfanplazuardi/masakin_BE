export class CreateRecipeDto {
  title: string;
  image_url: string;
  video_url: string;
  description?: string;
  difficulty: number;
  time_estimation: number;
}
