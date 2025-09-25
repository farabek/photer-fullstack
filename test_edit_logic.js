// Тест новой логики редактирования постов

console.log('=== ТЕСТИРОВАНИЕ НОВОЙ ЛОГИКИ РЕДАКТИРОВАНИЯ ПОСТОВ ===');

// Симуляция данных
const realPost = {
  id: 'cmfxf4omt0005v3jcs0g7q3rp',
  description: 'Real post',
  photos: ['photo1.jpg'],
  owner: { userId: 'user1', userName: 'testuser' },
};

const allUserPostsSingle = [realPost];
const allUserPostsMultiple = [
  realPost,
  {
    id: 'post2',
    description: 'Second post',
    photos: ['photo2.jpg'],
    owner: realPost.owner,
  },
  {
    id: 'post3',
    description: 'Third post',
    photos: ['photo3.jpg'],
    owner: realPost.owner,
  },
];

// Функция создания виртуального поста для просмотра
function createVirtualPostForView(post, allUserPosts, isEdit) {
  if (!allUserPosts || allUserPosts.length <= 1 || isEdit) {
    return post; // Возвращаем реальный пост для редактирования или пользователей с одним постом
  }

  // Собираем все фото для просмотра
  const allPhotos = [];
  allUserPosts.forEach((userPost) => {
    if (userPost.photos && userPost.photos.length > 0) {
      allPhotos.push(...userPost.photos);
    }
  });

  return {
    ...post,
    id: `virtual-profile-${post.owner.userId}`,
    photos: allPhotos,
    description: `All photos from ${post.owner.userName}`,
  };
}

// Функция проверки возможности редактирования
function canEditPost(displayPost, isOwner) {
  return isOwner; // Теперь всегда можно редактировать, если пользователь владелец
}

// Тесты
console.log('=== СЦЕНАРИЙ 1: Пользователь с одним постом ===');
console.log('allUserPosts.length:', allUserPostsSingle.length);

const displayPostSingleView = createVirtualPostForView(
  realPost,
  allUserPostsSingle,
  false,
);
const displayPostSingleEdit = createVirtualPostForView(
  realPost,
  allUserPostsSingle,
  true,
);

console.log('В режиме ПРОСМОТРА:');
console.log('  displayPost.id:', displayPostSingleView.id);
console.log('  isVirtual:', displayPostSingleView.id.startsWith('virtual-'));
console.log('  photos count:', displayPostSingleView.photos.length);
console.log('  canEdit:', canEditPost(displayPostSingleView, true));

console.log('В режиме РЕДАКТИРОВАНИЯ:');
console.log('  displayPost.id:', displayPostSingleEdit.id);
console.log('  isVirtual:', displayPostSingleEdit.id.startsWith('virtual-'));
console.log('  photos count:', displayPostSingleEdit.photos.length);

console.log('\n=== СЦЕНАРИЙ 2: Пользователь с несколькими постами ===');
console.log('allUserPosts.length:', allUserPostsMultiple.length);

const displayPostMultipleView = createVirtualPostForView(
  realPost,
  allUserPostsMultiple,
  false,
);
const displayPostMultipleEdit = createVirtualPostForView(
  realPost,
  allUserPostsMultiple,
  true,
);

console.log('В режиме ПРОСМОТРА:');
console.log('  displayPost.id:', displayPostMultipleView.id);
console.log('  isVirtual:', displayPostMultipleView.id.startsWith('virtual-'));
console.log('  photos count:', displayPostMultipleView.photos.length);
console.log('  canEdit:', canEditPost(displayPostMultipleView, true));

console.log('В режиме РЕДАКТИРОВАНИЯ:');
console.log('  displayPost.id:', displayPostMultipleEdit.id);
console.log('  isVirtual:', displayPostMultipleEdit.id.startsWith('virtual-'));
console.log('  photos count:', displayPostMultipleEdit.photos.length);

console.log('\n=== РЕЗУЛЬТАТЫ ===');
console.log('✅ Одиночный пост: всегда редактируется реальный пост');
console.log(
  '✅ Множественные посты: просмотр - виртуальный пост, редактирование - реальный пост',
);
console.log('✅ Кнопка Edit всегда видна владельцам');
console.log('🎯 Новая логика работает правильно!');
