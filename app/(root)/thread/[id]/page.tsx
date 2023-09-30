import ThreadCard from "@/components/cards/ThreadCards";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";
import Thread from "@/lib/models/thread.model";
import { useEffect, useState } from "react";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  console.log("new thing bro new thing");
  if (!params.id || !user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onBoarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);
  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={thread?.id || ""}
          parentId={thread.parentId} // this should be null in general
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((childItem: any, index: number) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={childItem?.id || ""}
            parentId={childItem.parentId} // this should be null in general
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
            isLast={index !== thread.children.length - 1} // to determine which element is the last one
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
