<template>
  <div id="home">
    <div>
        <h2 class="p-4">현재 상영작</h2>
    </div>
    <div v-if="movies[0].id">
      <carousel-3d :controls-visible="true" :width="400" :height="550" :border="0" :display="7" :inverseScaling="100">
        <slide v-for="(slide, i) in slides" :index="i" :key="i">
          <template slot-scope="{ index, isCurrent, leftIndex, rightIndex }">
            <router-link :to="`/movies/${movies[i].id}`">
              <img :src="`https://image.tmdb.org/t/p/w500/${movies[i].poster_path}`" alt="" :data-index="index" :class="{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >=0)}">
            </router-link>
          </template>
        </slide>
      </carousel-3d>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import NowMovieList from './NowMovieList.vue'
import { Carousel3d, Slide } from 'vue-carousel-3d'

const API_KEY = process.env.VUE_APP_TMDB_API_KEY

export default {
  name: 'Home',
  data: function () {
    return {
      movies: [
        { id: '',}
      ],
      slides: 20
    }
  },
  components: {
    // NowMovieList,
    Carousel3d,
    Slide
  },
  methods: {
    getGenres: function () {
      const Django_URL = 'http://127.0.0.1:8000'
      axios({
      meethod: 'get',
      url: `${Django_URL}/movies/genre/`
      })
        .then(res => {
          // console.log(res.data)
          this.$store.dispatch('genresList', res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
  },
  created: function () {
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR`,
    })
      .then((res) => {
        const movies = res.data.results
        this.slides = movies.length
        this.movies = movies
        this.$store.dispatch('nowMovies', movies)
      })
      .catch((err) => {
        console.log(err)
      })
    this.getGenres()
  },
}
</script>

<style>
.carousel {
  height: 600px;
  margin: 0px;
  background-color: rgb(20, 21, 23);
}
.next[data-v-05517ad0], .prev[data-v-05517ad0] {
  color: #fff;
}
</style>