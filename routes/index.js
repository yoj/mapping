
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.sample1 = function(req, res){
	var id = req.param('id');
	//res.send(id, {'Content-type':'text/plain'}, 200);
	res.render('foo', {
		title: 'jade uesing sample',
		var1: 'iPhone',
		var2: 'Mac',
		var3: req.param('id')
	});
};

exports.node = function(req, res){
	var name = req.param('param');
	res.send(name, {'Content-type':'text/plain'}, 200);
};