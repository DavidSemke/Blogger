require('dotenv').config()
const bcrypt = require('bcryptjs')
const User = require("../models/user");
const BlogPost = require("../models/blogPost");
const Comment = require("../models/comment");
const ReactionCounter = require("../models/reactionCounter");
const Reaction = require("../models/reaction");
const path = require('path')
const fs = require('fs')

const users = []
const blogPosts = []
const comments = []
const reactionCounters = []

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connecter = process.env.MONGO_DB_CONNECT
main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(connecter);
    
    console.log("Debug: Should be connected?");
    await createUsers()
    await createBlogPosts()
    await createComments()
    await createReactionCounters()
    await createReactions()

    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

// uses password hashing
async function userCreate(index, userData) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(userData.password, 10, async (err, hash) => {
            if (err) {
                reject(err)
            }
            
            const user = new User({
                username: userData.username,
                password: hash,
                profile_pic: userData.profile_pic
            });

            await user.save();
            users[index] = user;
            resolve(user);
        })
    })
}

async function blogPostCreate(index, blogPostData) {
    const blogPost = new BlogPost(blogPostData);
    await blogPost.save();
    blogPosts[index] = blogPost;
}

async function commentCreate(index, commentData) {
    const comment = new Comment(commentData);
    await comment.save();
    comments[index] = comment;
}

async function reactionCounterCreate(index, counterData) {
    const counter = new ReactionCounter(counterData)
    await counter.save()
    reactionCounters[index] = counter
}

async function reactionCreate(reactionData) {
    const reaction = new Reaction(reactionData)
    await reaction.save()
}



async function createUsers() {
    console.log("Adding users")

    const profile_pic = {
        data: fs.readFileSync(
            path.join(
                process.cwd(),
                'test',
                'images',
                'hero-image.webp'
            )
        ),
        contentType: 'image/webp'
    }

    await Promise.all([
        userCreate(
            0, 
            { 
                username: 'aaaaaa', 
                password: 'aaaaaa',
                profile_pic
            }
        ),
        userCreate(
            1, 
            { 
                username: 'bbbbbb', 
                password: 'bbbbbb',
                profile_pic 
            }
        ),
        userCreate(
            2, 
            { 
                username: 'cccccc', 
                password: 'cccccc',
                profile_pic 
            }
        ),
        userCreate(
            3, 
            { 
                username: 'dddddd', 
                password: 'dddddd',
                profile_pic 
            }
        )
    ]);
}

async function createBlogPosts() {
    console.log("Adding blogPosts");

    const thumbnail = {
        data: fs.readFileSync(
            path.join(
                process.cwd(),
                'test',
                'images',
                'hero-image.webp'
            )
        ),
        contentType: 'image/webp'
    }

    // public versions
    await Promise.all([
        blogPostCreate(
            0, 
            { 
                title: 'Local puppies adopted!',
                thumbnail,
                author: users[0],
                publish_date: Date.now(),
                last_modified_date: Date.now(),
                keywords: ['dog', 'adoption'],
                content: '<p>Puppies adopted, everyone is happy!</p>',
            }
        ),
        blogPostCreate(
            1, 
            { 
                title: 'Thugs have cars!',
                thumbnail,
                author: users[1],
                publish_date: Date.now(),
                last_modified_date: Date.now(),
                keywords: ['bully', 'vehicle', 'drive-by'],
                content: '<p>Thug cars are really loud! They must go!</p>',
            }
        ),
        blogPostCreate(
            2, 
            { 
                title: 'I have ants in my pants!',
                thumbnail,
                author: users[0],
                publish_date: Date.now(),
                last_modified_date: Date.now(),
                keywords: ['pest', 'clothes'],
                content: '<p>Please call a doctor. Or an exterminator? Call one of them. Or maybe both.</p>',
            }
        ),
        blogPostCreate(
            3, 
            { 
                title: 'Why Humanity Should Make Wasps Go Extinct',
                thumbnail,
                author: users[1],
                publish_date: Date.now(),
                last_modified_date: Date.now(),
                keywords: ['insect', 'bully'],
                content: '<p>Wasps suck.</p>',
            }
        ),
        blogPostCreate(
            4, 
            { 
                title: 'How to Make a Proper PB and J',
                thumbnail,
                author: users[0],
                publish_date: Date.now(),
                last_modified_date: Date.now(),
                keywords: ['food', 'tasting'],
                content: '<p>First you slather on the peanut butter. Then you add the jam on the other half. Then you smoosh both halves together. You\'re welcome.</p>',
            }
        ),
        blogPostCreate(
            5, 
            { 
                title: 'Why You Don\'t Need to Go to the Doctor.',
                thumbnail,
                author: users[1],
                publish_date: Date.now(),
                last_modified_date: Date.now(),
                keywords: ['healthcare', 'medicine'],
                content: '<p>Eat an apple and take a bath, hippie.</p>',
            }
        )
    ]);

    // private versions (last 4 indexes are NOT published)
    await Promise.all([
        blogPostCreate(
            6, 
            { 
                title: 'Local puppies adopted!',
                thumbnail,
                author: users[0],
                publish_date: Date.now(),
                last_modified_date: Date.now(),
                keywords: ['dog', 'adoption'],
                content: '<p>Puppies adopted, everyone is happy!</p>',
                public_version: blogPosts[0]
            }
        ),
        blogPostCreate(
            7, 
            { 
                title: 'Thugs have cars!',
                thumbnail,
                author: users[1],
                publish_date: Date.now(),
                last_modified_date: Date.now(),
                keywords: ['bully', 'vehicle', 'drive-by'],
                content: '<p>Thug cars are really loud! They must go!</p>',
                public_version: blogPosts[1]
            }
        ),
        blogPostCreate(
            8, 
            { 
                title: 'I have ants in my pants!',
                thumbnail,
                author: users[0],
                publish_date: Date.now(),
                last_modified_date: Date.now(),
                keywords: ['pest', 'clothes'],
                content: '<p>Please call a doctor. Or an exterminator? Call one of them. Or maybe both.</p>',
                public_version: blogPosts[2]
            }
        ),
        blogPostCreate(
            9, 
            { 
                title: 'Why Humanity Should Make Wasps Go Extinct',
                thumbnail,
                author: users[1],
                publish_date: Date.now(),
                last_modified_date: Date.now(),
                keywords: ['insect', 'bully'],
                content: '<p>Wasps suck.</p>',
                public_version: blogPosts[3]
            }
        ),
        blogPostCreate(
            10, 
            { 
                title: 'How to Make a Proper PB and J',
                thumbnail,
                author: users[0],
                publish_date: Date.now(),
                last_modified_date: Date.now(),
                keywords: ['food', 'tasting'],
                content: '<p>First you slather on the peanut butter. Then you add the jam on the other half. Then you smoosh both halves together. You\'re welcome.</p>',
                public_version: blogPosts[4]
            }
        ),
        blogPostCreate(
            11, 
            { 
                title: 'Why You Don\'t Need to Go to the Doctor.',
                thumbnail,
                author: users[1],
                publish_date: Date.now(),
                last_modified_date: Date.now(),
                keywords: ['healthcare', 'medicine'],
                content: '<p>Eat an apple and take a bath, hippie.</p>',
                public_version: blogPosts[5]
            }
        ),
        blogPostCreate(
            12, 
            { 
                title: 'Spiders in my basement!',
                thumbnail,
                author: users[0],
                last_modified_date: Date.now(),
                keywords: ['arachnid', 'scary'],
                content: '<p>Adventurer, I need you to squish 80 spiders!</p>',
            }
        ),
        blogPostCreate(
            13, 
            { 
                title: 'Only you can prevent forest fires!',
                thumbnail,
                author: users[1],
                last_modified_date: Date.now(),
                keywords: ['burn', 'wood'],
                content: '<p>I smoked a forest yesterday and dreamt of magical jacuzzi.</p>',
            }
        ),
        blogPostCreate(
            14, 
            { 
                title: 'I shipped my pants!',
                thumbnail,
                author: users[0],
                last_modified_date: Date.now(),
                keywords: ['amazon', 'bezos'],
                content: '<p>I did not like my Amazon order so I am returning the pants, thanks Obama.</p>',
            }
        ),
        blogPostCreate(
            15, 
            { 
                title: 'Don\'t worry guys I\'m 6ft!',
                thumbnail,
                author: users[1],
                last_modified_date: Date.now(),
                keywords: ['tall', 'short'],
                content: '<p>I used to be 5\' 11.99" but now I\'m 6ft and no one can tell me otherwise!</p>',
            }
        ),
    ]);
}

async function createComments() {
    console.log("Adding comments");

    await Promise.all([
        commentCreate(
            0,
            {
                author: users[2],
                blog_post: blogPosts[0],
                publish_date: Date.now(),
                content: 'Yay puppies!',
            }
        ),
        commentCreate(
            1,
            {
                author: users[3],
                blog_post: blogPosts[0],
                publish_date: Date.now(),
                content: 'Everyone loves puppies!',
            }
        ),
        commentCreate(
            2,
            {
                author: users[1],
                blog_post: blogPosts[1],
                publish_date: Date.now(),
                content: 'I am a thug and I am keeping my car!',
            }
        ),
        commentCreate(
            3,
            {
                author: users[2],
                blog_post: blogPosts[1],
                publish_date: Date.now(),
                content: 'Thugs be tripping.',
            }
        )
    ]);

    await Promise.all([
        commentCreate(
            4,
            {
                author: users[0],
                blog_post: blogPosts[0],
                publish_date: Date.now(),
                content: 'Puppies!',
                reply_to: comments[0]
            }
        ),
        commentCreate(
            5,
            {
                author: users[1],
                blog_post: blogPosts[1],
                publish_date: Date.now(),
                content: 'I will become mayor and take your car!',
                reply_to: comments[2]
            }
        )
    ])
}

async function createReactionCounters() {
    console.log("Adding reaction counters");

    const reactionCounters = []
    const postGroups = [
        {
            type: 'BlogPost',
            collection: blogPosts
        },
        {
            type: 'Comment',
            collection: comments
        }
    ]
    const combns = [[1, 1], [1, 0], [0, 1], [0, 0]]
    let combnIndex = 0

    for (const postGroup of postGroups) {
        const { type: postType, collection: posts } = postGroup
        
        for (const post of posts) {
            const combn = combns[combnIndex % combns.length]
            const [likeCount, dislikeCount] = combn

            reactionCounters.push(
                {
                    content: {
                        content_type: postType,
                        content_id: post
                    },
                    like_count: likeCount,
                    dislike_count: dislikeCount
                }
            )

            combnIndex++
        }
    }

    await Promise.all(
        reactionCounters.map((
            (reactionCounter, index) => {
                return reactionCounterCreate(index, reactionCounter)
            }
        ))
    )
}

async function createReactions() {
    console.log("Adding reactions");

    const reactions = []
    const postGroups = [
        {
            type: 'BlogPost',
            collection: blogPosts
        },
        {
            type: 'Comment',
            collection: comments
        }
    ]
    let userIndex = 0

    for (const postGroup of postGroups) {
        const { type: postType, collection: posts } = postGroup

        for (let i=0; i<posts.length; i++) {
            const post = posts[i]
            const reactionCounter = reactionCounters[i]
            const likeCount = reactionCounter.like_count
            const dislikeCount = reactionCounter.dislike_count
            const reactionGroups = [
                {
                    reactionType: 'Like',
                    count: likeCount
                },
                {
                    reactionType: 'Dislike',
                    count: dislikeCount
                },
            ]

            for (const reactionGroup of reactionGroups) {
                const { reactionType, count } = reactionGroup
    
                for (let i=0; i<count; i++) {
                    reactions.push(
                        {
                            user: users[userIndex % users.length],
                            content: {
                                content_type: postType,
                                content_id: post
                            },
                            reaction_type: reactionType
                        }
                    )
    
                    userIndex++
                }
            }
        }   
    }

    await Promise.all(
        reactions.map((reaction => reactionCreate(reaction)))
    )
}