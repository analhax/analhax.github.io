const loadFile = function() {
  let content = 0;
  $("#header").load("https://analhax.github.io/header.html");
  $("#footer").load("https://analhax.github.io/footer.html");
  $.ajax({
      type: "GET",
      url: "https://analhax.github.io/head.html",
      dataType: "html"
    })
    .done(function(result) {
      content = result;
      $("head").prepend(content)
    });
};

const setTitle = function() {
  let title = $('meta[property="og:title"]').attr("content");
  $("head").append("<title>" + title + "</title>");
};

const setDesc = function() {
  let desc = $('meta[property="og:description"]').attr("content");
  $("head").append('<meta name="description" content="' + desc + '">');
};

const addDiaryList = function() {
  let meta, title, date;
  $.ajax({
      type: "GET",
      url: "https://analhax.github.io/diary-data/index.html",
      dataType: "html"
    })
    .done(function(result) {
      meta = $(result).filter('meta[name="diary-start"]');
      length = meta.length;
      for (i = 0; i < length; i++) {
        title = $(meta[i]).data("title");
        date = $(meta[i]).data("date");
        content = '<a href=article?id=' + date + ' class="block-link"><div class="diary-box"><h1>' + title + '</h1><time>' + date + '</time></div></a>';
        $(".diary-boxes").append(content);
      }
    });
};

const addDiary = function() {
  let data, id, thisMeta, thisTitle, thisDate, startNum, endNum, thisContent;
  let i = 0;
  let isFind = true;
  $.ajax({
      type: "GET",
      url: "https://analhax.github.io/diary-data/index.html",
      dataType: "html"
    })
    .done(function(result) {
      data = $(result);
      id = $(location).attr("search").slice(4, 14);
      while (isFind) {
        isFind = $(data[i]).data("date") != id;
        i++;
        if (i > data.length) {
          window.location.href = "https://analhax.github.io/404";
          return;
        }
      }
      startNum = i - 1;
      thisMeta = data[startNum];
      thisTitle = $(data[startNum]).data("title");
      thisDate = $(data[startNum]).data("date");

      isFind = true;
      i = startNum;
      thisContent = $();
      while (isFind) {
        isFind = $(data[i]).attr("name") != "diary-end";
        thisContent = thisContent.add($(data[i]));
        i++;
      }
      endNum = i - startNum - 1;
      thisContent = thisContent.not("meta");

      $(".wrapper").html("<h1>" + thisTitle + "</h1>");
      $(".wrapper").append(thisContent);
      $(".wrapper").append("<time>" + thisDate + "</time>");
      $("head").append("<title>" + thisTitle + " | analhaxのホームページ</title>");
    });
};

const addProjectList = function() {
  let meta, title, id;
  $.ajax({
      type: "GET",
      url: "https://analhax.github.io/projects-data/index.html",
      dataType: "html"
    })
    .done(function(result) {
      meta = $(result).filter('meta[name="project-start"]');
      length = meta.length;
      for (i = 0; i < length; i++) {
        title = $(meta[i]).data("title");
        id = $(meta[i]).data("id");
        $("#projects").append(content);
      }
    });
};

const addProject = function() {
  let data, id, thisMeta, thisTitle, thisId, thisQuery, startNum, endNum, thisContent;
  let i = 0;
  let isFind = true;
  if ($(location).attr("search").length < 4) {
    window.location.href = "https://analhax.github.io/404";
  }
  id = $(location).attr("search").match(/(?<=\=).*$/)[0];
  $.ajax({
      type: "GET",
      url: "https://analhax.github.io/projects-data/index.html",
      dataType: "html"
    })
    .done(function(result) {
      data = $(result);
      while (isFind) {
        isFind = $(data[i]).data("id") != id;
        i++;
        if (i > data.length || id.match(/^.\d$/) != null) {
          window.location.href = "https://analhax.github.io/404";
          return;
        }
      }
      startNum = i - 1;
      thisMeta = data[startNum];
      thisTitle = $(data[startNum]).data("title");
      thisId = $(data[startNum]).data("id");
      thisQuery = $(data[startNum]).data("query");

      isFind = true;
      i = startNum;
      thisContent = $();
      while (isFind) {
        isFind = $(data[i]).attr("name") != "project-end";
        thisContent = thisContent.add($(data[i]));
        i++;
      }
      endNum = i - startNum - 1;
      thisContent = thisContent.not("meta");

      $("#scratch-project iframe").attr("src", "https://turbowarp.org/" + thisId + "/embed" + thisQuery);
      $(".view-on-scratch").attr("href", "https://scratch.mit.edu/projects/" + thisId);
      $(".caption").append(thisContent);
      $("head").append("<title>" + thisTitle + " | analhaxのホームページ</title>")
    });
};

$(function() {
  loadFile();
  addProjectList();
  const pathName = $(location).attr("pathname");
  if (pathName == "/diary/") {
    addDiaryList();
  }
  if (pathName == "/diary/article") {
    addDiary();
  } else if (pathName == "/projects/work") {
    addProject()
  } else {
    setTitle();
  }
  setDesc();
});
