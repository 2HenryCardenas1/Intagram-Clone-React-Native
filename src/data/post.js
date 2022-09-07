import { USERS } from "./user";

export const POSTS = [
    {
        imageUrl: 'https://www.nintenderos.com/wp-content/uploads/2022/01/super-mario-fa.jpg',
        user: USERS[0].user,
        likes: 1403,
        caption: ' This is a super mario 😲',
        profile_picture: USERS[0].image,
        comments: [
            {
                user: 'Luigi',
                comment: 'This is a super mario, he is a boring character jeje 🤣'
            },
            {
                user: 'Yoshi',
                comment: 'My friend 👍'
            }
        ]
    },
    {
        imageUrl: 'https://gcdn.lanetaneta.com/wp-content/uploads/2022/04/Diseno-inicial-revelado-para-Princess-Peach-de-Super-Mario.jpg',
        user: USERS[4].user,
        likes: 3540,
        caption: ' Kiss 💋',
        profile_picture: USERS[4].image,
        comments: [
            {
                user: 'Mario',
                comment: 'This is my girlfriend 💋'
            },
            {
                user: 'Yoshi',
                comment: 'My friend 👍'
            }
        ]
    }

]