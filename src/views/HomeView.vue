<script setup>
import { computed } from 'vue'
import { RESOURCES, getRatings, calculateAverage } from '@/data'

const featured = computed(() =>
  RESOURCES.slice(0, 3).map(r => {
    const ratings = getRatings()
    return { ...r, avgRating: calculateAverage(ratings[r.id] || r.ratings) }
  })
)
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7">
            <h1 class="display-4 fw-bold">
              Your mental health<br>matters. We're here to help.
            </h1>
            <p class="lead mb-4 opacity-75">
              MindWell Connect provides free, accessible mental health resources,
              peer support, and professional guidance &mdash; all in one safe, welcoming space.
            </p>
            <div class="d-flex gap-3 flex-wrap">
              <router-link
                to="/resources"
                class="btn btn-light btn-lg fw-bold px-4"
              >
                Explore Resources
              </router-link>
              <router-link
                to="/register"
                class="btn btn-outline-light btn-lg px-4"
              >
                Join Now
              </router-link>
            </div>
          </div>
          <div class="col-lg-5 text-center mt-4 mt-lg-0">
            <i
              class="bi bi-heart-pulse"
              style="font-size: 8rem; opacity: 0.7;"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-5">
      <div class="container">
        <h2 class="text-center fw-bold mb-1">
          How MindWell Connect Helps
        </h2>
        <p class="text-center text-muted mb-4">
          Evidence-based tools and compassionate support for your mental health journey
        </p>
        <div class="row g-4 mt-2">
          <div class="col-md-4">
            <div class="feature-card">
              <div class="display-4 mb-3">
                &#x1F4DA;
              </div>
              <h5>Resource Library</h5>
              <p class="text-muted">
                Browse articles, videos, and worksheets created by mental health professionals.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card">
              <div class="display-4 mb-3">
                &#x1F91D;
              </div>
              <h5>Find Support</h5>
              <p class="text-muted">
                Connect with qualified counsellors and peer support groups. Book appointments.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card">
              <div class="display-4 mb-3">
                &#x1F4CA;
              </div>
              <h5>Track Progress</h5>
              <p class="text-muted">
                Monitor your wellbeing with self-assessment tools and mood tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Resources -->
    <section class="py-5 bg-white">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="fw-bold mb-0">
            Featured Resources
          </h2>
          <router-link
            to="/resources"
            class="btn btn-mw-outline btn-sm"
          >
            View All &rarr;
          </router-link>
        </div>
        <div class="row g-4">
          <div
            v-for="r in featured"
            :key="r.id"
            class="col-md-4"
          >
            <div class="resource-card">
              <img
                :src="r.image"
                :alt="r.title"
                class="card-img-top"
                loading="lazy"
              >
              <div class="card-body d-flex flex-column">
                <span
                  class="resource-type-badge mb-2 align-self-start"
                  :class="'badge-' + r.type"
                >{{ r.type }}</span>
                <h5 class="card-title">
                  {{ r.title }}
                </h5>
                <p class="card-text text-muted small">
                  {{ r.description }}
                </p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                  <span class="rating-stars readonly">
                    <span
                      v-for="s in 5"
                      :key="s"
                      class="star"
                      :class="{ filled: s <= Math.round(r.avgRating) }"
                    >&#9733;</span>
                    <small class="ms-1 text-muted">{{ r.avgRating }}</small>
                  </span>
                  <router-link
                    :to="'/resources/' + r.id"
                    class="btn btn-mw-outline btn-sm"
                  >
                    View
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-5">
      <div class="container">
        <div class="row g-4 text-center">
          <div class="col-6 col-md-3">
            <div class="display-5 fw-bold text-primary">
              12
            </div>
            <p class="text-muted">
              Evidence-Based Resources
            </p>
          </div>
          <div class="col-6 col-md-3">
            <div class="display-5 fw-bold text-primary">
              3
            </div>
            <p class="text-muted">
              Resource Categories
            </p>
          </div>
          <div class="col-6 col-md-3">
            <div class="display-5 fw-bold text-primary">
              5
            </div>
            <p class="text-muted">
              Registered Counsellors
            </p>
          </div>
          <div class="col-6 col-md-3">
            <div class="display-5 fw-bold text-primary">
              24/7
            </div>
            <p class="text-muted">
              Crisis Support
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
