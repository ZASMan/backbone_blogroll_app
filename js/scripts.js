//Backone Model

var Blog = Backbone.Model.extend({
	
	//Default values for models
	defaults: {
		author: '',
		title: '',
		url: '',
	}
});


//Backbone Collection
//Array of models

var Blogs = Backbone.Collection.extend({


});



/*Instantiate two Blogs

var blog1 = new Blog({
	author: 'Zane',
	title: 'Zane\'s Life',
	url: 'https://wikipedia.org',
});


var blog2 = new Blog({
	author: 'John',
	title: 'John\'s Life',
	url: 'htps://www.google.com'

});
*/
//Instantiate a collection

var blogs = new Blogs();

//Backbone View for One Blog

var BlogView = Backbone.View.extend({

	model: new Blog(),
	//Will be injected into tbody. Each individual blog will have
	//its own table row
	tagName: 'tr',
	initialize: function() {
		this.template = _.template($('.blogs-list-template').html()); 
	},
	events: {
		'click .edit-blog': 'edit',
		'click .update-blog': 'update',
		'click .cancel': 'cancel',
		'click .delete-blog': 'delete'
	},
	edit: function () {
		this.$('.edit-blog').hide();
		this.$('.delete-blog').hide();
		this.$('.update-blog').show();
		this.$('.cancel').show();
		
		//Store the Values of the HTML
		var author = this.$('.author').html();
		var title = this.$('.title').html();
		var url = this.$('.url').html();

		//Change them to input elements to be edited
		this.$('.author').html('<input type="text" class="form-control author-update" value="' + author + '">');
		this.$('.title').html('<input type="text" class="form-control author-update" value="' + title + '">');
		this.$('.url').html('<input type="text" class="form-control author-update" value="' + url + '">');

	},
	update:function() {
		this.model.set('author', $('.author-update').val());
		this.model.set('title', $('.title-update').val());
		this.model.set('url', $('.url-update').val());
	},
	//Refresh the page to reset everything to default
	cancel: function() {
		blogsView.render();
	},
	delete: function() {
		this.model.destroy();
	},
	render: function() {
		//This refers to the 'tr'
		//Inserts data from new model into JSON
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

//Backbone View for All Blogs

var BlogsView = Backbone.View.extend({
	model: blogs,
	el: $('.blogs-list'),
	//Every time a blog is added to the collections blog,
	//render this view
	initialize: function() {
		var self = this;
		this.model.on('add', this.render, this);
		this.model.on('change', function() {
			setTimeout(function() {
				self.render();
			}, 30);
		}, this);
		this.model.on('remove', this.render, this);
	},
	//Empty the $el,
	//For each blog in blogs collection (this.model)
	//For each individual blog
	//For each blog, we will row, we will append a new BlogView
	//With the model: blog
	render: function() {
		//Little hack since this won't work inside _.each method
		var self = this;
		this.$el.html('');
		_.each(this.model.toArray(), function(blog) {
			//Append a new table row
			self.$el.append((new BlogView({model: blog})).render().$el);
		});
		return this;
	}
});

var blogsView = new BlogsView();


//Listeners for user input
$(document).ready(function() {
	$('.add-blog').on('click',function() {
		var blog = new Blog({
			author: $('.author-input').val(),
			title: $('.title-input').val(),
			url: $('.url-input').val()
		});
		$('.author-input').val('');
		$('.title-input').val('');
		$('.url-input').val('');
		console.log(blog.toJSON());
		blogs.add(blog);
	});

})

