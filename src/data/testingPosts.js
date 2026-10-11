
export const testingPosts = [
    {
        id: 1,
        user_id: 1,
        username: "Alex",
        avatar_url: "",
        title: "Welcome to the club!",
        content:
            "Every run is a chance to clear your mind. Let's keep moving together!",
        image_url: "",
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        visibility: "public",
    },
    {
        id: 2,
        user_id: 2,
        username: "Jamie",
        avatar_url: "",
        title: "Morning miles",
        content:
            "Started the day with a peaceful run. Sometimes, all you need is fresh air and a little movement.",
        image_url: "",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        visibility: "public",
    },
    {
        id: 3,
        user_id: 3,
        username: "Sam",
        avatar_url: "",
        title: "One step at a time",
        content:
            "Not every run needs to be fast. Today, I just enjoyed the journey.",
        image_url: "",
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        visibility: "public",
    },
];