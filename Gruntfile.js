module.exports = function (grunt) {
	grunt.initConfig({
		clean: ['docs'],
		apidoc: {
			docs: {
				src: 'config/',
				dest: 'docs/'
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-apidoc');


	grunt.registerTask('default', ['clean', 'apidoc']);
};