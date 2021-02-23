<template>
  <div class="article-item">
    <van-cell
      class="article-item-cell"
      :to="{
        name: 'article',
        params: {
          articleId: article.art_id,
        },
      }"
    >
      <div class="title van-multi-ellipsis--l2" slot="title">
        {{ article.title }}
      </div>
      <div slot="label">
        <div class="cover-wrap" v-if="article.cover.type === 3">
          <div
            :key="index"
            v-for="(img, index) in article.cover.images"
            class="cover-wrap-item"
          >
            <van-image
              class="cover-wrap-item-img"
              height="73"
              fit="cover"
              :src="img"
            />
          </div>
        </div>
        <div class="label-wrap">
          <span>{{ article.aut_name }} </span>
          <span>{{ article.comm_count }}条评论 </span>
          <span>{{ article.pubdate | relativeTime }}前发布</span>
        </div>
      </div>
      <van-image
        v-if="article.cover.images.length === 1"
        class="right-cover"
        fit="cover"
        :src="article.cover.images[0]"
      />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'ArticleItemIndex',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.article-item {
  .article-item-cell {
    .title {
      font-size: 16px;
      color: #3a3a3a;
    }
    /deep/ .van-cell__value {
      flex: unset;
      width: 116px;
      height: 73px;
      margin-left: 12px;
      .right-cover {
        width: 116px;
        height: 73px;
      }
    }
  }
  .cover-wrap {
    padding: 15px 0;
    display: flex;
    .cover-wrap-item {
      flex: 1;
      flex-wrap: nowrap;
      height: 73px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-wrap-item-img {
        width: 100%;
        height: 73px;
      }
    }
  }
  .label-wrap {
    font-size: 11px;
    color: #b4b4b4;
    span {
      margin-right: 13px;
    }
  }
}
</style>
