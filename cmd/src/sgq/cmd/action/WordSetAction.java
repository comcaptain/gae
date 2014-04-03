package sgq.cmd.action;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import sgq.cmd.bean.WordSet;
import sgq.cmd.util.PMF;

import com.opensymphony.xwork2.ActionSupport;

public class WordSetAction extends ActionSupport{

	/**
	 * 
	 */
	private static final long serialVersionUID = 6755577083032284008L;
	private List<WordSet> wordSetList;
	public List<WordSet> getWordSetList() {
		return wordSetList;
	}
	public void setWordSetList(List<WordSet> wordSetList) {
		this.wordSetList = wordSetList;
	}
	@SuppressWarnings("unchecked")
	public String retrieveWordSetList() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(WordSet.class);
			this.wordSetList = (List<WordSet>) query.execute();
		}
		finally {
			pm.close();
		}
		return SUCCESS;
	}
}
