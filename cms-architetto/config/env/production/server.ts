export default ({ env }: any) => ({
  url: env('PUBLIC_URL', ''),
});
