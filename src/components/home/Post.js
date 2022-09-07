import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Divider } from 'react-native-elements'
import { db, firebase } from '../../../firebase'

const iconsFooter = [
    {
        name: 'Like',
        imageUrl: 'https://img.icons8.com/ios/344/ffffff/like--v1.png',
        likedImageUrl : 'https://img.icons8.com/color/344/like--v3.png'
    },
    {
        name: 'Comment',
        imageUrl: 'https://img.icons8.com/ios/344/ffffff/speech-bubble--v1.png'
    },
    {
        name: 'Share',
        imageUrl: 'https://img.icons8.com/ios/344/ffffff/sent.png'
    },
    {
        name: 'Save',
        imageUrl: 'https://img.icons8.com/ios/344/ffffff/bookmark-ribbon--v1.png'
    },

]

export default function Post({ post }) {

    const handleLike = (post) => {
        const currentLikeStatus = !post.likes_by_users.includes(
            firebase.auth().currentUser.email
        )

        db.collection('users')
            .doc(post.owner_email)
            .collection('posts')
            .doc(post.id)
            .update({
                likes_by_users: currentLikeStatus
                    ? firebase.firestore.FieldValue.arrayUnion(
                        firebase.auth().currentUser.email)
                    : firebase.firestore.FieldValue.arrayRemove(
                        firebase.auth().currentUser.email)
            })
            .then(() => {
                console.log('like updated')
            })
            .catch(error => {
                console.log('Error ', error)
            })
    }


    return (
        <View style={{ marginBottom: 30 }}>
            <Divider width={1} orientation='vertical' />
            <PostHeader post={post} />
            <PostImage post={post} />
            <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                <PostFooter handleLike={handleLike} post={post} />
                <Likes post={post} />
                <Caption post={post} />
                <CommentsSeccion post={post} />
                <Comments post={post} />
            </View>
        </View>

    )

}

const PostHeader = ({ post }) => (
    <View style={styles.postHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: post.profile_picture }} style={styles.postHeaderImage} />
            <Text style={styles.postHeaderText}>{post.username}</Text>

        </View>
        <Text style={{ color: 'white', fontWeight: '900' }}>...</Text>
    </View>
)

const PostImage = ({ post }) => (
    <View style={{ width: '100%', height: 300 }}>
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
    </View>
)

const PostFooter = ({ handleLike, post }) => (
    <View style={{ flexDirection: 'row' }}>
        <View style={styles.leftFooterIconsContainer}>
            <TouchableOpacity onPress={()=> handleLike(post)}>
                <Image style={styles.postFooterIcon} source={{ uri: post.likes_by_users.includes(
                    firebase.auth().currentUser.email)
                    ? iconsFooter[0].likedImageUrl
                    : iconsFooter[0].imageUrl
                    
                     }} />
            </TouchableOpacity>
           
            <Icon imgStyle={styles.postFooterIcon} imgUrl={iconsFooter[1].imageUrl} />
            <Icon imgStyle={styles.postFooterIcon} imgUrl={iconsFooter[2].imageUrl} />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Icon imgStyle={styles.postFooterIcon} imgUrl={iconsFooter[3].imageUrl} />
        </View>

    </View>
)

const Icon = ({ imgStyle, imgUrl }) => (
    <TouchableOpacity>
        <Image style={imgStyle} source={{ uri: imgUrl }} />
    </TouchableOpacity>
)

const Likes = ({ post }) => (
    <View style={{ flexDirection: 'row', marginTop: 4 }}>
        <Text style={{ color: 'white', fontWeight: '600' }}>
            {post.likes_by_users.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} likes</Text>

    </View>
)

const Caption = ({ post }) => (
    <View style={{ marginTop: 5 }}>
        <Text style={{ color: 'white' }}>
            <Text style={{ fontWeight: '600' }}>{post.username}</Text>
            <Text> {post.caption}</Text>

        </Text>
    </View>
)

//A) 0 comentarios no renderisara el componente
//B) 1 comentario renderisara el componente con el texto "1 comment"
//C) 2 comentarios renderisara el componente con el texto "2 comments"

const CommentsSeccion = ({ post }) => (
    <View style={{ marginTop: 5 }}>
        {!!post.comments.length && (
            <Text style={{ color: 'gray' }}>
                {/* Estados para mostrar si tiene uno o varios coemntarios */}
                View{post.comments.length > 1 ? ' all ' : ' '}{post.comments.length}{' '}
                {post.comments.length > 1 ? 'comments' : 'comment'}
            </Text>
        )}
    </View>
)

const Comments = ({ post }) => (
    <>
        {post.comments.map((comment, index) => (
            <View key={index} style={{ flexDirection: 'row', marginTop: 5 }}>
                <Text style={{ color: 'white' }}>
                    <Text style={{ fontWeight: '600' }}>{comment.username}</Text>{' '}
                    {comment.comment}
                </Text>
            </View>
        ))}
    </>
)


const styles = StyleSheet.create({
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
        alignItems: 'center',

    },
    postHeaderImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 6,
        borderWidth: 1.6,
        borderColor: "#ff8501"
    },
    postHeaderText: {
        color: 'white',
        marginLeft: 5,
        fontWeight: '700',
    },
    postImage: {
        height: '100%',
        resizeMode: 'cover',
    },
    postFooterIcon: {
        width: 30,
        height: 30,

    },
    leftFooterIconsContainer: {
        flexDirection: 'row',
        width: '32%',
        justifyContent: 'space-between',
    },

})