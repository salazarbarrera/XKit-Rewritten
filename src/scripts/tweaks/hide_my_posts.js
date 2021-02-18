(function () {
  const excludeClass = 'xkit-tweaks-hide-my-posts-done';
  const hiddenClass = 'xkit-tweaks-hide-my-posts-hidden';
  const css = `[data-pathname="/dashboard"] .${hiddenClass} article { display: none; }`;

  let defaultBlog;

  const processPosts = async function () {
    const { getPostElements } = await fakeImport('/util/interface.js');
    const { timelineObjectMemoized } = await fakeImport('/util/react_props.js');

    getPostElements({ excludeClass }).forEach(async postElement => {
      const { canEdit, isSubmission, postAuthor } = await timelineObjectMemoized(postElement.dataset.id);

      if (canEdit && (isSubmission || postAuthor === defaultBlog || postAuthor === undefined)) {
        postElement.classList.add(hiddenClass);
      }
    });
  };

  const main = async function () {
    const { fetchDefaultBlog } = await fakeImport('/util/user_blogs.js');
    const { onNewPosts } = await fakeImport('/util/mutations.js');
    const { addStyle } = await fakeImport('/util/interface.js');

    ({ name: defaultBlog } = await fetchDefaultBlog());

    onNewPosts.addListener(processPosts);
    processPosts();

    addStyle(css);
  };

  const clean = async function () {
    const { onNewPosts } = await fakeImport('/util/mutations.js');
    const { removeStyle } = await fakeImport('/util/interface.js');

    onNewPosts.removeListener(processPosts);
    removeStyle(css);

    $(`.${excludeClass}`).removeClass(excludeClass);
    $(`.${hiddenClass}`).removeClass(hiddenClass);
  };

  return { main, clean };
})();