<template>
  <div id="rank-reco">
    <div class="title-nav row">
      <div id="rank-reco-title" class="col-4">
        <h2 v-if="this.$store.state.loginUser" class="row m-0 pt-4 p-4 pb-0">{{ this.$store.state.loginUser }}님</h2>
        <h2 v-else class="row m-0 pt-4 p-4 pb-0">비회원님</h2>
        <h4 class="row m-0 p-4 pt-3">평점 기준 추천</h4>
      </div>
    </div>

    <div v-if="this.$store.state.loginUser" name="rank-reco-main">
      <div id="rank-reco-movie" class="m-2 mb-1 container mx-auto" >
        <div id="rank-movie" class="movie-list row">
          <movie-item v-for="movie in myBestMovie" :key="movie.id" :movie="movie"></movie-item>
        </div>
      </div>
      <div id="rank-btn" class="row justify-content-center">
        <button class=" col-2" @click="rankReco">관련 영화 더보기</button>
      </div>
    </div>
    <div v-else class="m-5 container">
      <h3 class="center">평점 기준 추천을 받으려면 로그인을 하세요.</h3>
      <router-link class="center-login" to="/login">로그인하러 가기</router-link>
    </div>
    <!-- <div id="rank-reco-main">
      <div class="mt-5 center-center">
        <div name="rank-reco-main-movie">
          <movie-item v-for="movie in myBestMovie" :key="movie.id" :movie="movie"></movie-item>
        </div>
        <div name="rank-reco-main-btn">
          <button @click="rankReco">추천 받기</button>
        </div>
      </div>
    </div> -->

  </div>
</template>

<script>
import MovieItem from '../movies/MovieItem.vue'
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'RankReco',
  components: {
    MovieItem,
  },
  data: function () {
    return {
      myBestMovie: null,
    }
  },
  methods: {
    setToken: function () {
      const token = localStorage.getItem("jwt")
      const config = {
        Authorization: `JWT ${token}`,
      }
      return config;
    },
    bestMovie: function () {
      const Django_URL = 'http://127.0.0.1:8000'
      const userID = this.$store.state.userInfo.id
      axios({
        method: 'get',
        url: `${Django_URL}/movies/recommendation/rank/${userID}/`,
        headers: this.setToken(),
      })
        .then(res => {
          const movies = res.data
          const bestMovies = movies.filter((movie) => {
            if (movie.user_rank == 5) {
              return movie
            }
          })
          const allMovies = this.$store.state.movies
          const bestMovie = _.sample(bestMovies)
          this.myBestMovie = allMovies.filter((movie) => {
            if (movie.id == bestMovie.movie) {
              return movie
            }
          })
          console.log(this.myBestMovie)
        })
        .catch(err => {
          console.log(err)
        })
    },
    rankReco: function () {
      const genreID = _.sample(this.myBestMovie[0].genres)
      this.$router.push({
        name: 'GenreRecoDetail',
        params: {
          genre_id: genreID
        }
      })
    },
  },
  created: function () {
    this.bestMovie()
  },
}
</script>

<style>
#rank-reco-main {
  align-content: center;
}
#rank-reco-movie #rank-movie {
  justify-content: center;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.center-login {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3rem;
  text-decoration: none;
}
</style>