<template>
  <div id="movie-detail" class="card row">
    <div class="card-body offset-md-2 col-8">
      <div name="movie-header">
        <div class="movie-title">
          <span>{{ movie.title }}</span>
        </div>
        <div class="movie-original-title">
          <span>&lt; {{ movie.original_title }} &gt;</span>
        </div>
      </div>
      
      <div name="movie-detail" class="row mt-5">
        <div name="movie-image" class="col-6">
          <img :src="imageURL" alt="movie image" class="card-img-top" />
        </div>

        <div id="movie-content" class="col-6">
          <div class="rank">
            <div name="tmdb" class="rank-frame row" >
              <div class="tmdb-rank-title col-6" style="height: 40px">
                <span>TMDB 평점</span>
              </div>
              <div class="rank col" style="font-weight: bold;">
                {{ movie.rank }}
                <span style="font-size: 15px"> &nbsp; / &nbsp; 5 </span>
              </div>
            </div>
            <div name="user" class="rank-frame row" >
              <div class="tmdb-rank-title col-6" style="height: 40px">
                <span>사용자 평점</span>
              </div>
              <div class="rank col">
                <div name="movie-user-rank" >
                  <div v-if="value && this.$store.state.loginUser">
                    <b-form-rating v-model="value" color="#603217" icon-empty="slash-circle" icon-full="slash-circle-fill" inline no-border readonly style="background-color: rgb(20, 21, 23); margin-top: 2px;"></b-form-rating>
                    <button class="btn update-rank-btn" style="color: white;" data-bs-toggle="modal" data-bs-target='#rankModal'>수정</button>
                  </div>
                  <div v-else-if="!value && this.$store.state.loginUser">
                    <b-form-rating @change="myRating" v-model="value" color="#603217" icon-empty="slash-circle" icon-full="slash-circle-fill" inline no-border style="background-color: rgb(20, 21, 23); margin-top: 2px;"></b-form-rating>
                  </div>
                  <div v-else-if="!this.$store.state.loginUser">
                    <b-form-rating value="0" color="#603217" icon-empty="slash-circle" icon-full="slash-circle-fill" inline no-border disabled></b-form-rating>
                  </div>

                  <div class="modal fade" id="rankModal" tabindex="-1" aria-labelledby="rankModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content" style="background-color: rgb(93, 94, 95);">
                        <div class="modal-header" style="justify-content: center;">
                          <h3 class="modal-title col-2" id="exampleModalLabel">평점</h3>
                          <b-form-rating v-model="value" style="background-color: rgb(93, 94, 95)" color="#603217" icon-empty="slash-circle" icon-full="slash-circle-fill" inline no-border @change="myRatingUpdate"></b-form-rating>
                        </div>
                        <div class="modal-footer">
                          <button class="btn btn-warning" @click="myRatingDelete">삭제</button>
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="reload">닫기</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="movie-info row">
            <div name="movie-genre" class="mt-2">
              <span style="font-weight: bold;">장르&nbsp; | &nbsp;</span>
              <span v-for="(genre, idx) in genres" :key="idx">
                {{ genre }} &nbsp;
              </span> 
            </div>
            <div name="movie-related-date" >
              <div class="movie-genre mt-2">
                <span style="font-weight: bold;">개봉일&nbsp; | &nbsp;</span>
                <span >{{ movie.release_date }}</span>
              </div>
            </div>
          </div> 

          <div name="i-want-see">
            <div name="movie-like" class="col my-3">
              <span>
                <img :src="iconURL" alt="" style="width: 35px; height: 35px;" @click="updateLikes">
              </span>
                찜콩 +
            </div> 
          </div> 

          <div class="movie-story">
            <div class="movie-story-title mb-2">
              줄거리
            </div>
            <div class="word" style="weight: 250px">
              {{ movie.story }}
            </div>

          </div>
          
          <div name="movie-youtube">
            <youtube-video :youtubeVideo="youtubeVideo"></youtube-video>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YoutubeVideo from './YoutubeVideo.vue'
import axios from 'axios'
import swal from 'sweetalert'

// const API_KEY = process.env.VUE_APP_YOUTUBE_API_KEY
const API_KEY ='AIzaSyA8a3hwIdb8EJ1fOv1MGV7qdyT8nPLiDzM'
const API_URL = 'https://www.googleapis.com/youtube/v3/search'


const Django_URL = 'http://127.0.0.1:8000'

export default {
  name: 'MovieDetail',
  components: {
    YoutubeVideo,
    // vueStarRate,
  },
  data: function () {
    return {
      value: 0,
      movie: null,
      liked: false,
      likeCount: 0,
      rankData: {
        user_rank: this.$store.state.userRank,
        user: this.$store.state.userInfo.id,
        movie: 0,
      },
      rankID: 0,
      genres_name: [],
      youtubeVideo: '',
    };
  },
  methods: {
    reload: function () {
      this.$router.go()
    },
    setToken: function () {
      const token = localStorage.getItem("jwt")
      const config = {
        Authorization: `JWT ${token}`,
      }
      return config;
    },
    getLikeMovies: function () {
      this.$store.dispatch('getMovies')
      const movies = this.$store.state.movies
      const likeMovies = movies.filter((movie) => {
        const userID = this.$store.state.userInfo.id
        if (movie.like_users.includes(userID)) {
          return movie
        }
      })
      this.movies = likeMovies
      this.$store.dispatch('likeMovies', likeMovies)
    },
    updateLikes: function () {
      axios({
        method: 'post',
        url: `${Django_URL}/movies/${this.movie.id}/likes/`,
        headers: this.setToken(),
      })
        .then((res) => {
          const { liked, likeCount } = res.data
          this.liked = liked;
          this.likeCount = likeCount;
          this.getLikeMovies()
        })
        .catch((err) => {
          console.log(err)
          swal('오류', '찜콩하려면 로그인하세요.', 'error')
        })
    },
    myRating: function () {
      // event.preventDefault()
      this.rankData.user_rank = this.value
      console.log(this.value)
      const Django_URL = 'http://127.0.0.1:8000'
      axios({
        method: 'post',
        url: `${Django_URL}/movies/${this.movie.id}/rank/`,
        data: this.rankData,
        headers: this.setToken()
      })
        .then(res => {
          console.log(res)
          this.rankData.user_rank = this.value
          this.getUserRank()
        })
        .catch(err => {
          console.log(err)
        })
    },
    myRatingUpdate: function (rating) {
      this.rankData.user_rank = rating
      const Django_URL = 'http://127.0.0.1:8000'
      axios({
        method: 'put',
        url: `${Django_URL}/movies/${this.movie.id}/rank/${this.rankID}/`,
        data: this.rankData,
        headers: this.setToken()
      })
        .then(res => {
          console.log(res)
          swal('완료', res.data.message, 'success')
        })
        .catch(err => {
          console.log(err)
        })
    },
    myRatingDelete: function () {
      const Django_URL = 'http://127.0.0.1:8000'
      axios({
        method: 'delete',
        url: `${Django_URL}/movies/${this.movie.id}/rank/${this.rankID}/`,
        headers: this.setToken()
      })
        .then(res => {
          console.log(res)
          this.getUserRank()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getUserLikes: function () {
      const Django_URL = 'http://127.0.0.1:8000'
      const token = localStorage.getItem("jwt")
      // 좋아요 GET
      axios({
        method: "get",
        url: `${Django_URL}/movies/${this.movie.id}/likes/`,
        headers: {
          Authorization: `JWT ${token}`
        },
      })
        .then((res) => {
          const { liked, likeCount } = res.data
          this.liked = liked
          this.likeCount = likeCount
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getUserRank: function () {
      const Django_URL = 'http://127.0.0.1:8000'
      const token = localStorage.getItem("jwt")
      // 평점 GET
      axios({
        method: 'get',
        url: `${Django_URL}/movies/${this.movie.id}/rank/`,
        headers: {
          Authorization: `JWT ${token}`
        },
      })
        .then(res => {
          console.log(res)
          this.rankID = res.data.id
          const userRank = res.data.user_rank
          this.rankData.user_rank = userRank
          this.value = userRank
        })
        .catch(err => {
          console.log(err)
        })
    },
    getYoutubeVideo: function () {
      const params = {
        key: API_KEY,
        part: 'snippet',
        q: this.movie.title + ' 공식 예고편',
        type: 'video',
      }
      axios({
        method: 'get',
        url: API_URL,
        params: params,
      })
        .then(res => {
          console.log(res)
          const youtubeVideos = res.data.items
          this.youtubeVideo = youtubeVideos[0]
        })
        .catch(err => {
          console.log(err)
        })
    },
  },
  computed: {
    iconURL: function () {
      if (this.liked) {
        return `${Django_URL}/static/movies/bean_full.png`
      } else {
        return `${Django_URL}/static/movies/bean_empty.png`
      }
    },
    imageURL: function () {
      const movieImage = this.movie.poster_path
      return `https://image.tmdb.org/t/p/original/${movieImage}`
    },
    genres: function () {
      const genres = this.movie.genres
      const genresList = this.$store.state.genresList
      const genresName = this.genres_name
      console.log(genresName)
      for (var i= 0; i < genres.length; i ++) {
        // console.log(genres.length)
        for (var j= 0; j < genresList.length; j ++) {
          // console.log(j)
          if (Object.values(genresList[j]).includes(genres[i])) {
            genresName.push(genresList[j].name)
          }
        }
      }
      return genresName
    },
  },
  created: function () {
    const movie_id = this.$route.params.movie_id
    const movies = this.$store.state.movies
    if (movie_id) {
      const selectedmovie = movies.filter((movie) => {
        if (movie.id == movie_id) {
          return movie
        }
      })
      this.movie = selectedmovie[0]
      this.rankData.movie = selectedmovie[0].id
      this.rankData.user = this.$store.state.userInfo.id
    }
    this.getUserLikes()
    this.getUserRank()
    this.getYoutubeVideo()
  },
}
</script>

<style>
#movie-detail {
    background-color: rgb(20, 21, 23);
  }
#movie-detail .movie-title {
  text-align: center;
  margin: 10px;
  font-weight: bold;
  font-size: 50px;
}
#movie-detail .movie-original-title {
  text-align: center;
  margin: 2px;
  font-size: 20px;
}
.rank-frame {
  margin-bottom: 5px;
  font-size: 18px;
  align-content: center;
}
.rank-frame .tmdb-rank-title {
  background-color: #633111;
  border: 2px solid rgb(56, 56, 56);
}
.rank-frame .rank {
  border: 2px solid rgb(56, 56, 56);
}
.update-rank-btn {
  background-color: #38383800;
  color: white;
}
.movie-info {
  font-size: 15px;
}
.movie-story {
  font-size: 17px;
}
.movie-story-title {
  margin: 3px;
  font-size: 15px;
  font-weight:700;
}
.word {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>