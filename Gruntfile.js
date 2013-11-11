module.exports = function(grunt) {
	//Configuration goes here
	grunt.initConfig({
		jshint: {
			all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
		},
		// Configure the copy task to move files from the development to production folders
		simplemocha: {
			options: {
				globals: ['should'],
				timeout: 3000,
				ignoreLeaks: false,
				ui: 'bdd',
				reporter: 'tap'
			},

			all: { src: ['test/*.js'] }
		},
		copy: {
			target: {
				files: [
					{expand: true, src:['**'], dest:'public/', cwd: 'prod/'},
					{expand: true, src:['docs/*'], dest:'public/'}]
			}
		},
		uglify: {
			my_target: {
				src: 'src/**/*.js',
				dest: 'prod/build.js'
			}
		},
		yuidoc: {
			compile: {
				options: {
					paths: 'src/',
					outdir: 'docs/'
				}
			}
		}
	});

	//Load Pluins here
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	//Define your tasks here
	grunt.registerTask('default', ['simplemocha', 'jshint', 'uglify', 'yuidoc', 'copy']);
};