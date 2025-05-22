import { extractYouTubeID } from "@/lib/utils";
import { getSummaryById } from "@/data/loaders";
import ClientYouTubePlayer from "@/components/custom/client-youtube-player";

export default async function SummarySingleRoute({
  params,
  children,
}: {
  readonly params: any;
  readonly children: React.ReactNode;
}) {
  const { videoId } = await params;
  const data = await getSummaryById(videoId);
  if (data?.error?.status === 404) return <p>No Items Found</p>;
  const videoYTId = extractYouTubeID(data.data.videoId);
  
  return (
    <div>
      <div className="h-full grid gap-4 grid-cols-5 p-4">
        <div className="col-span-3">{children}</div>
        <div className="col-span-2">
          <ClientYouTubePlayer videoId={videoYTId as string} />
        </div>
      </div>
    </div>
  );
}