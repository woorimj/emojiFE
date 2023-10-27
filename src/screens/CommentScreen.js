import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EvilIcons from "react-native-vector-icons/EvilIcons";

// 사용하고자 하는 이모지에 따라 import 이름이 다름 
const CommentScreen = ({route}) => {
  const postId = route.params.postId;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [comment, setComment] = useState('');
  const [change, setChange] = useState(1);
  const [token, setToken] = useState('');

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token') || '';
      console.log('토큰 확인');
      console.log(storedToken);
      setToken(storedToken);
      if (token == null) { console.log('Token not found');}
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  useEffect(() => {
    getToken();
    
    axios.get('http://localhost:8080/v1/posts/'+postId+'/comments')
        .then((res) => {
          console.log(res.data.result);
          setComments(res.data.result);
        })
        .catch((err)=>{
            console.log(err)
        })
   }, [change])
 

  // 제일 처음에 화면 출력할 때 db에서 댓글 리스트 가져와서 comments에 추가
  
  // 댓글 작성한 거 db에 전송
  const handleCommentSubmit = () => {
    if (newComment.trim() == "") {
      Alert.alert("댓글 입력 확인", "댓글을 입력해주세요!");
    } else {
      axios.post('http://localhost:8080/v1/posts/'+postId+'/comments',
        {
          content: newComment,
        }, {
          headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(function(resp) {
          console.log('댓글 등록 성공!');
          Alert.alert("게시글 등록 성공!", "댓글이 성공적으로 등록되었습니다.");
          setChange(prev => prev + 1);
          console.log("change : " + change);
        }).catch(error => {
          console.error('API 요청 에러:', error);
        })
    }
  };

  const deleteComment = (itemId) => {
    setComment(itemId);

    getToken();
    axios.delete('http://localhost:8080/v1/posts/' + postId + '/comments/' + comment, 
    {
      headers: {
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
        Alert.alert("댓글 삭제 완료", "댓글이 성공적으로 삭제되었습니다.");
        setChange(prev => prev + 1);
    })
    .catch((err)=>{
        console.log(err)
    })
   }

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
            <View style={styles.commentItem}>
                <View>
                    <Text style={styles.commentTitle}>{item.username}</Text>
                    <Text style={styles.commentText}>{item.content}</Text>
                </View>
                <TouchableOpacity onPress={()=>deleteComment(item.commentId)}>  
                  <EvilIcons name="trash" size={30} color="black" marginRight={5}/>
                </TouchableOpacity>
            </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add a comment..."
          placeholderTextColor="#d3d3d3" 
          value={newComment}
          onChangeText={setNewComment}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={handleCommentSubmit}
          style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  commentTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentText: {
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#C4C1CC',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CommentScreen;
