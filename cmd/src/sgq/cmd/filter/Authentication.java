package sgq.cmd.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

public class Authentication implements Filter{

	@Override
	public void destroy() {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		UserService us = UserServiceFactory.getUserService();
		HttpServletResponse rs = (HttpServletResponse) response;
		HttpServletRequest rq = (HttpServletRequest) request;
		String loginUrl = us.createLoginURL((rq.getRequestURI()));
		if (us.getCurrentUser() == null && rq.getRequestURI().indexOf("/_ah") != 0) {
			rs.sendRedirect(loginUrl);
		}
		chain.doFilter(request, response);
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}

}
