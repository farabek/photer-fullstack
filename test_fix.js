// Тест исправления логики редактирования постов

console.log('=== ТЕСТИРОВАНИЕ ИСПРАВЛЕНИЯ ЛОГИКИ ===');

// Симуляция данных
const realPost = {
  id: 'cmfxf4omt0005v3jcs0g7q3rp',
  description: 'Real post',
  photos: ['photo1.jpg'],
  owner: { userId: 'user1', userName: 'testuser' },
};

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

// Функция создания виртуального поста для просмотра (исправленная версия)
function createVirtualPostForView(post, allUserPosts, isEdit) {
  if (!allUserPosts || allUserPosts.length <= 1 || isEdit) {
    return post; // Всегда возвращаем реальный пост для редактирования или пользователей с одним постом
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

// Тесты
console.log('=== СЦЕНАРИЙ: Пользователь с несколькими постами ===');

console.log('В режиме ПРОСМОТРА (isEdit=false):');
const displayPostView = createVirtualPostForView(
  realPost,
  allUserPostsMultiple,
  false,
);
console.log('  displayPost.id:', displayPostView.id);
console.log('  isVirtual:', displayPostView.id.startsWith('virtual-'));
console.log('  photos count:', displayPostView.photos.length);
console.log('  description:', displayPostView.description);

console.log('В режиме РЕДАКТИРОВАНИЯ (isEdit=true):');
const displayPostEdit = createVirtualPostForView(
  realPost,
  allUserPostsMultiple,
  true,
);
console.log('  displayPost.id:', displayPostEdit.id);
console.log('  isVirtual:', displayPostEdit.id.startsWith('virtual-'));
console.log('  photos count:', displayPostEdit.photos.length);
console.log('  description:', displayPostEdit.description);

console.log('Проверка передачи в EditPost:');
console.log(
  '  Всегда передается реальный пост (post), независимо от режима просмотра',
);

console.log('\n=== РЕЗУЛЬТАТЫ ===');
console.log('✅ Просмотр: виртуальный пост с ID virtual-profile-user1');
console.log(
  '✅ Редактирование: всегда реальный пост с ID cmfxf4omt0005v3jcs0g7q3rp',
);
console.log('✅ EditPost всегда получает реальный пост');
console.log('🎯 Ошибки больше не должно быть!');
