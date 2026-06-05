import ReelCard from "../components/ReelCard";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useGetAllReels from "../hooks/getAllReels";
import { useEffect } from "react";
import { updateReel } from "../redux/reelSlice";

const Reels = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reelData = useSelector((state) => state.reel.reelData || []);
  const { socket } = useSelector((state) => state.socket);

  useGetAllReels();

  useEffect(() => {
    if (!socket) return;
    const handleLike = (data) => {
      dispatch(
        updateReel({
          reelId: data.reelId,
          likes: data.likes,
        }),
      );
    };


    const handleComment = (data) => {
      dispatch(
        updateReel({
          reelId: data.reelId,
          comments: data.comments,
        }),
      );
    };

    socket.on("likeReel", handleLike);
    socket.on("commentReel", handleComment);

    return () => {
      socket.off("likeReel", handleLike);
      socket.off("commentReel", handleComment);
    };
  }, [socket, dispatch]);

  return (
    <div className="w-screen h-screen bg-black flex justify-center overflow-hidden">
      <div className="w-full max-w-[500px] h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        <div className="fixed top-0 left-0 w-full max-w-[500px] flex items-center gap-4 p-4 z-50">
          <MdOutlineKeyboardBackspace
            className="w-6 h-6 cursor-pointer text-white"
            onClick={() => navigate("/")}
          />
          <h1 className="text-white text-lg font-semibold">Reels</h1>
        </div>

        {reelData.map((reel) => (
          <div
            key={reel._id}
            className="h-screen snap-start flex items-center justify-center"
          >
            <ReelCard reel={reel} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reels;
