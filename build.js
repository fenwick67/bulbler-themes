var fs = require('fs-extra')
var _ = require('lodash');
var path = require('path');
var pug = require('pug');
var sass = require('node-sass');

module.exports = function build(){


var lorem = ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et mollis nunc, non mollis lacus. Donec pharetra lacus at mauris pulvinar, vestibulum lacinia ligula viverra. Curabitur semper lobortis nulla non efficitur. Aliquam cursus non tortor vitae mattis. Proin sagittis elit sed risus rutrum, sed pulvinar neque lacinia. Donec ac dui aliquam, placerat ligula et, imperdiet nunc. Donec vulputate massa non dui fermentum, nec rhoncus lorem feugiat. Nulla vitae augue quis lectus lacinia fermentum at ac ex. Cras ac mauris et mi dictum pretium at non felis. Aenean lobortis metus in ante pellentesque, mattis aliquam ex accumsan. Nunc ut vehicula augue. Donec sed cursus erat. '

var loremIpsum = `<h1>HTML Ipsum Presents</h1>
<p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>
<h2>Header Level 2</h2>
<ol>
   <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
   <li>Aliquam tincidunt mauris eu risus.</li>
</ol>
<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote>

<h1>Header Level 1</h1>
<h2>Header Level 2</h2>
<h3>Header Level 3</h3>
<h4>Header Level 4</h4>
<h5>Header Level 5</h5>
<h6>Header Level 6</h6>

<ul>
   <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
   <li>Aliquam tincidunt mauris eu risus.</li>
</ul>
<p>Try some <code>code</code> on for size!</p>
<pre><code>#header h1 a {
  display: block;
  width: 300px;
  height: 80px;
}
</code></pre>`

var themeInfo = JSON.parse(fs.readFileSync('themeinfo.json','utf8'))

var data = {
  _:_,
  site:{
    authorName:"Your Name",
    title:"Site Title",
    description: 'Site Description goes here.  It will look like this.  ',
    avatar: '../../placeholders/avatar.png',
    pageCount:10,
    tags:[
      {name:"photos",count:25},
      {name:"development",count:14},
      {name:"math",count:5}
    ]
  },
  page:{
    posts:[{
      title:"A Post!",
      id:"ABCDEFG",
      caption:'<p>These are some photos!</p>',
      tags:['math','development'],
      permalink:"#",
      date:new Date('October 30, 2017'),
      englishDate:'October 30, 2017',
      assets:[
        {
          type:"image",
          widget:'<a class="asset"><img src="../../placeholders/asset-2.jpg"></img></a>',
          mimetype:"image/jpeg",
          href:"../../placeholders/asset-2.jpg",
          featured:true,
          inline:false
        },{
          type:"image",
          widget:'<a class="asset"><img src="../../placeholders/asset-3.jpg"></img></a>',
          mimetype:"image/jpeg",
          href:"../../placeholders/asset-3.jpg",
          featured:false,
          inline:false
        },
      ],
    },
    {
      caption:loremIpsum,
      id:"ABCDEFH",
      permalink:"#",
      date:new Date('October 10, 2017'),
      englishDate:'October 10, 2017',
      assets:[
        {
          type:"image",
          widget:'<a class="asset"><img src="../../placeholders/asset-1.jpg"></img></a>',
          mimetype:"image/jpeg",
          href:"../../placeholders/asset-1.jpg",
          featured:false,
          inline:false
        }
      ],
    }],
    isCustom:false,
    isIndex:true,
    number:1,
    customContent:null,
    links:{
      nextPage:'#',
      previousPage:null,
      firstPage:"#",
      lastPage:"#"
    },
    url:"https://example.com"
  }
};

// clone posts
for (var i = 0; i < 4; i ++){
  data.page.posts.push(_.cloneDeep(data.page.posts[0]));
  data.page.posts[data.page.posts.length-1].title='Another post!';
  data.page.posts[data.page.posts.length-1].assets.push(data.page.posts[0].assets[0]);
}

// custom page
var data2 = _.cloneDeep(data);
data2.page.posts = null;
data2.page.isCustom = true;
data2.page.isIndex = false;
data2.page.links = {};
data2.page.customPage = {
  title:"Custom Page",
  content:"<p>This is some custom content for the page!</p><p>"+lorem+"</p>"
};

// also test a page of a tag
var data3 = _.cloneDeep(data);
data3.page.number = 5;
data3.page.links.nextPage = '#';
data3.page.isIndex = false;
data3.page.tag = "math";
data3.page.links.previousPage="#";
data3.page.posts.map(function(post){
  if (!post.tags){post.tags = []}
  if (post.tags.indexOf('math') > -1){return;}
  post.tags.push('math');
  return post;
});

// single post page
var data4 = _.cloneDeep(data);
data4.page.isIndex = false;
data4.page.posts[0].assets.push(data4.page.posts[1].assets[0]);
data4.page.posts = [data4.page.posts[0]];
delete data4.page.number;
data4.page.posts[0].assets[1].inline=true;
data4.page.posts[0].caption = `
<p>The bird is a featured, non-inlined asset.</p>
<p>The bokeh circles are a non-featured, non-inlined asset.</p>
<p>Themes can handle asset rendering logic as they wish.</p>
<p>This image is directly in the post content:</p>
<a class="asset"><img src="../../placeholders/asset-3.jpg"></img></a>
<p>Now for some HTML.</p>
${loremIpsum}`;

var pageDatum = [data,data2,data3,data4];

pageDatum.forEach(data=>{
  if (!data.posts){return}
  data.posts.forEach(p=>p.content = p.caption)
})

var themes = _.orderBy(
  _.filter(fs.readdirSync('themes'),
    function filter(filename){
      return filename.indexOf('.pug') > -1;
    }
  ),_.identity,'desc'
);
console.log(themes);
var themeCompiledFn = pug.compileFile(path.join('templates','theme.pug'));

var themeNames = [];

themes.forEach(function(templateFilename){
  var name = templateFilename.replace(/\..*/g,'');
  themeNames.push(name);
  var templateFn = pug.compileFile(path.join('themes',templateFilename));
  fs.ensureDirSync(path.join('theme-previews',name));
  var anglicizedName = name.split('-').map(_.capitalize).join(' ')
  pageDatum.forEach(function(pageData,index){
    // write each page
    var locals = _.cloneDeep(pageData);
    locals.site.title = anglicizedName + ' Theme';
    if (themeInfo[name]){
      locals.site.description = anglicizedName+' is '+themeInfo[name].description;
    }
    fs.writeFileSync(path.join('theme-previews',name,(index+1)+'.html'),templateFn(locals));
  });

  // write an index for this theme, which has iframes to each page
  fs.writeFileSync(
    path.join('theme-previews',name,'index.html'),
    themeCompiledFn( { theme:name,_:_, urls:pageDatum.map(function(n,idx){return './' + (idx+1)}) })
  )

});

// now write index
fs.writeFileSync('index.html',pug.renderFile(path.join('templates','index.pug'),{themes:themeNames,_:_,themeInfo}));

//build scss
var scssFiles = fs.readdirSync('scss');
scssFiles.forEach(function(f){
  var css = sass.renderSync({
    data:fs.readFileSync(path.join('scss',f),'utf8')
  }).css;
  var outfile = path.join('css',f.replace('scss','css'));
  fs.writeFileSync(outfile,css);
})

console.log('build succeeded at '+new Date().toISOString())
}
